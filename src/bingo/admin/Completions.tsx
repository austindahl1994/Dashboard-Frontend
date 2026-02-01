import React, { useEffect, useState, useContext } from "react";
import { Table, Button, Modal, Spinner } from "react-bootstrap";
import { useQueryClient } from "@tanstack/react-query";
import { adminDelete } from "../../api";
import { ToastContext } from "../../main-components/ToastContext";

export interface Completion {
  team: number;
  tile_id: number;
  rsn: string;
  url: string | null;
  item: string;
  obtained_at?: string;
}

const formatObtainedAt = (v?: string) => {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return String(v);
  return d.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const Completions: React.FC<{ team?: number | null; data?: any }> = ({
  team = null,
  data,
}) => {
  const queryClient = useQueryClient();
  const completionsProp: Completion[] | null = Array.isArray(data)
    ? data
    : null;
  const [completions, setCompletions] = useState<Completion[] | null>(
    completionsProp,
  );
  const [showConfirm, setShowConfirm] = useState(false);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [modalItem, setModalItem] = useState<Completion | null>(null);
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [modalTileTitle, setModalTileTitle] = useState<string | null>(null);
  const [modalTileTier, setModalTileTier] = useState<number | null>(null);
  const { createToast } = useContext(ToastContext);

  useEffect(() => {
    setCompletions(completionsProp);
  }, [completionsProp]);

  return (
    <div
      style={{
        background: "#fff",
        padding: "20px 0",
        flex: 1,
        width: "100%",
        overflow: "auto",
        minHeight: 0,
      }}
    >
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <strong>Completions</strong>
        <div style={{ marginLeft: 12 }}>
          {team ? `Team ${team}` : "All teams"}
        </div>
      </div>

      {!completions && (
        <div style={{ marginTop: 12 }}>
          No data. Click "Fetch Data" in Admin.
        </div>
      )}

      {completions && (
        <div style={{ marginTop: 12 }}>
          <div>Returned: {completions.length} completions</div>
          <Table
            size="sm"
            bordered
            hover
            style={{ marginTop: 8, marginLeft: 0, marginRight: 0 }}
          >
            <thead>
              <tr>
                <th>Team</th>
                <th>Tile ID</th>
                <th>Item</th>
                <th>RSN</th>
                <th>URL</th>
                <th>Obtained At</th>
                <th style={{ width: 90 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {completions.map((c, i) => (
                <tr key={`${c.team}-${c.tile_id}-${i}`}>
                  <td>{c.team}</td>
                  <td>{c.tile_id}</td>
                  <td>{c.item}</td>
                  <td>{c.rsn}</td>
                  <td>
                    {c.url ? (
                      <a href={c.url} target="_blank" rel="noopener noreferrer">
                        View Image
                      </a>
                    ) : (
                      ""
                    )}
                  </td>
                  <td>{formatObtainedAt(c.obtained_at)}</td>
                  <td
                    style={{
                      width: 90,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        // populate modal with completion and related board tile info (title/tier)
                        setModalIndex(i);
                        setModalItem(c);
                        // try query cache first
                        try {
                          const boardCache = queryClient.getQueryData([
                            "board",
                          ]) as any[] | null;
                          let tile = boardCache?.find(
                            (b: any) => b.id === c.tile_id,
                          );
                          if (!tile) {
                            const boardJson = localStorage.getItem("board");
                            if (boardJson) {
                              const boardFromStorage = JSON.parse(
                                boardJson,
                              ) as any[];
                              tile = boardFromStorage.find(
                                (b: any) => b.id === c.tile_id,
                              );
                            }
                          }
                          setModalTileTitle(tile?.title ?? null);
                          setModalTileTier(
                            typeof tile?.tier === "number" ? tile.tier : null,
                          );
                        } catch (e) {
                          setModalTileTitle(null);
                          setModalTileTier(null);
                        }
                        setShowConfirm(true);
                      }}
                    >
                      DELETE
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Modal
            show={showConfirm}
            onHide={() => {
              if (!deleteInProgress) setShowConfirm(false);
            }}
            backdrop={deleteInProgress ? "static" : true}
            keyboard={!deleteInProgress}
          >
            <Modal.Header closeButton={!deleteInProgress}>
              <Modal.Title>Confirm delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {modalItem ? (
                <div>
                  <div>
                    <strong>Title:</strong> {modalTileTitle ?? "Unknown"}
                  </div>
                  <div>
                    <strong>Tier:</strong> {modalTileTier ?? "Unknown"}
                  </div>
                  <div>
                    <strong>ID:</strong> {modalItem.tile_id}
                  </div>
                  <div>
                    <strong>Item:</strong> {modalItem.item}
                  </div>
                  <div>
                    <strong>Team:</strong> {modalItem.team}
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <strong>RSN:</strong> {modalItem.rsn}
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <strong>Obtained:</strong>{" "}
                    {formatObtainedAt(modalItem.obtained_at)}
                  </div>
                  {deleteError ? (
                    <div style={{ marginTop: 12, color: "var(--bs-danger)" }}>
                      {deleteError}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowConfirm(false)}
                disabled={deleteInProgress}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={async () => {
                  if (modalIndex === null || !completions || !modalItem) return;
                  setDeleteError(null);
                  setDeleteInProgress(true);
                  try {
                    const passcode = localStorage.getItem("passcode");
                    // send url to adminDelete
                    await adminDelete({ passcode, url: modalItem.url });

                    const key = ["completions", passcode, team ?? "all"] as any;
                    const updated = completions.filter(
                      (_, idx) => idx !== modalIndex,
                    );
                    setCompletions(updated);
                    try {
                      queryClient.setQueryData(key, updated);
                    } catch (e) {}
                    setShowConfirm(false);
                    try {
                      createToast &&
                        createToast(
                          `Deleted completion: ${modalItem.rsn} (tile ${modalItem.tile_id})`,
                          1,
                        );
                    } catch (e) {}
                  } catch (err: any) {
                    console.error(err);
                    setDeleteError(err?.message || "Delete failed");
                    try {
                      createToast &&
                        createToast(
                          `Delete failed: ${err?.message || "Server error"}`,
                          0,
                        );
                    } catch (e) {}
                  } finally {
                    setDeleteInProgress(false);
                  }
                }}
                disabled={deleteInProgress}
              >
                {deleteInProgress ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Deleting...
                  </>
                ) : (
                  "DELETE"
                )}
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default Completions;
