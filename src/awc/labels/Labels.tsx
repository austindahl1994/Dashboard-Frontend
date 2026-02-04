import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useContext,
} from "react";
import { Button, Form, Card } from "react-bootstrap";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";
import "./labels.css";
import { ToastContext } from "../../main-components/ToastContext";

const ROWS = 10;
const COLS = 5;
const TOTAL = ROWS * COLS;

// styles moved to labels.css

const Labels: React.FC = () => {
  const [cells, setCells] = useState<string[]>(Array(TOTAL).fill(""));
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [delimiter, setDelimiter] = useState(", ");
  const { createToast } = useContext(ToastContext);
  const [autoSave, setAutoSave] = useState(false);

  function findNextIndexVertical(): number | null {
    for (let col = 0; col < COLS; col++) {
      for (let row = 0; row < ROWS; row++) {
        const idx = row * COLS + col;
        if (cells[idx] === "") return idx;
      }
    }
    return null;
  }
  const [targetIndex, setTargetIndex] = useState<number | null>(() => {
    // initial target is first empty cell
    return null; // will set after mount via effect-like behavior below
  });

  const extractBetweenUnderscores = useCallback((s: string) => {
    const first = s.indexOf("_");
    if (first === -1) return s.trim();
    const second = s.indexOf("_", first + 1);
    if (second === -1) return s.trim();
    return s.slice(first + 1, second).trim();
  }, []);

  // auto-save to localStorage when enabled (store column-major array)
  useEffect(() => {
    if (!autoSave) return;
    try {
      const out: string[] = [];
      for (let col = 0; col < COLS; col++) {
        for (let row = 0; row < ROWS; row++) {
          const idx = row * COLS + col;
          out.push(cells[idx] ?? "");
        }
      }
      localStorage.setItem("labels", JSON.stringify(out));
    } catch (err) {
      // ignore
    }
  }, [cells, autoSave]);

  const handleAdd = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    const label = extractBetweenUnderscores(trimmed);
    if (!label) return;

    const nextIndex =
      targetIndex !== null ? targetIndex : findNextIndexVertical();
    if (nextIndex === null) {
      alert("Table is full");
      return;
    }
    setCells((prev) => {
      const next = [...prev];
      next[nextIndex] = label;
      // compute next empty from the updated array
      let newNext: number | null = null;
      for (let col = 0; col < COLS; col++) {
        for (let row = 0; row < ROWS; row++) {
          const idx = row * COLS + col;
          if (next[idx] === "") {
            newNext = idx;
            break;
          }
        }
        if (newNext !== null) break;
      }
      setTargetIndex(newNext);
      return next;
    });
  };

  const saveEdit = (index: number) => {
    const val = editingValue.trim();
    setCells((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
    setEditingIndex(null);
    setEditingValue("");
  };

  const handleSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    handleAdd(input);
    setInput("");
    inputRef.current?.focus();
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd(input);
      setInput("");
      inputRef.current?.focus();
    }
  };
  // keep targetIndex in sync when cells change (initialize / fallback)
  React.useEffect(() => {
    if (targetIndex === null) {
      const firstEmpty = findNextIndexVertical();
      if (firstEmpty !== null) setTargetIndex(firstEmpty);
    }
  }, [cells]);

  // on mount: load saved labels (column-major order) into the grid
  useEffect(() => {
    try {
      const raw = localStorage.getItem("labels");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;
      const loaded: string[] = Array(TOTAL).fill("");
      for (let col = 0; col < COLS; col++) {
        for (let row = 0; row < ROWS; row++) {
          const p = col * ROWS + row;
          const idx = row * COLS + col;
          loaded[idx] = parsed[p] ?? "";
        }
      }
      setCells(loaded);
      // compute next empty target from loaded
      let firstEmpty: number | null = null;
      for (let col = 0; col < COLS; col++) {
        for (let row = 0; row < ROWS; row++) {
          const idx = row * COLS + col;
          if (loaded[idx] === "") {
            firstEmpty = idx;
            break;
          }
        }
        if (firstEmpty !== null) break;
      }
      setTargetIndex(firstEmpty);
    } catch (err) {
      // ignore
    }
  }, []);

  // helper to export CSV; if includeFiller=true, prepend a 'FILLER' row
  const exportCsv = (includeFiller: boolean) => {
    const rows: Array<{ [k: string]: string }> = [];
    if (includeFiller) rows.push({ "Serial Number": "FILLER" });
    for (let col = 0; col < COLS; col++) {
      for (let row = 0; row < ROWS; row++) {
        const idx = row * COLS + col;
        const v = (cells[idx] ?? "").toString().trim();
        if (v !== "") rows.push({ "Serial Number": v });
      }
    }
    const csv = Papa.unparse(rows, { header: true });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "labels.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  // export as Excel (.xlsx) using SheetJS (dynamic import)
  const exportXlsx = async (includeFiller: boolean) => {
    try {
      const XLSX = await import("xlsx");
      const rows: Array<{ [k: string]: string }> = [];
      if (includeFiller) rows.push({ "Serial Number": "FILLER" });
      for (let col = 0; col < COLS; col++) {
        for (let row = 0; row < ROWS; row++) {
          const idx = row * COLS + col;
          const v = (cells[idx] ?? "").toString().trim();
          if (v !== "") rows.push({ "Serial Number": v });
        }
      }
      const ws = XLSX.utils.json_to_sheet(rows, { header: ["Serial Number"] });
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Labels");
      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([wbout], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob as any);
      const a = document.createElement("a");
      a.href = url;
      a.download = "labels.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (err) {
      // dependency not installed
      // eslint-disable-next-line no-alert
      alert(
        "Install the 'xlsx' package (npm install xlsx) to enable Excel export.",
      );
    }
  };

  // export as simple XML
  const exportXml = (includeFiller: boolean) => {
    const rows: string[] = [];
    if (includeFiller) rows.push("FILLER");
    for (let col = 0; col < COLS; col++) {
      for (let row = 0; row < ROWS; row++) {
        const idx = row * COLS + col;
        const v = (cells[idx] ?? "").toString().trim();
        if (v !== "") rows.push(v);
      }
    }

    const escape = (s: string) =>
      s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&apos;");

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<Labels>\n';
    for (const v of rows) {
      xml += `  <Row>\n    <SerialNumber>${escape(v)}</SerialNumber>\n  </Row>\n`;
    }
    xml += "</Labels>";

    const blob = new Blob([xml], { type: "application/xml;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "labels.xml";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  const nextIndexForDisplay = targetIndex;

  return (
    <div className="labels-root">
      <h3>EN1941 Labels</h3>

      <div className="labels-main">
        <div className="labels-left">
          <Card className="labels-card">
            <Card.Body className="labels-card-body">
              <Form onSubmit={handleSubmit} className="mb-3">
                <div className="labels-input-row">
                  <Form.Control
                    type="text"
                    placeholder="Type input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{ flex: 1 }}
                    ref={(el: any) => (inputRef.current = el)}
                  />
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Form.Check
                      type="checkbox"
                      label="Auto-save"
                      checked={autoSave}
                      onChange={(e: any) => setAutoSave(e.target.checked)}
                      style={{ marginLeft: 8 }}
                    />
                  </div>
                  <Button type="submit">Submit</Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      setCells(Array(TOTAL).fill(""));
                      setTargetIndex(0);
                      setEditingIndex(null);
                      setEditingValue("");
                      try {
                        localStorage.removeItem("labels");
                      } catch (err) {
                        // ignore
                      }
                      inputRef.current?.focus();
                    }}
                  >
                    <strong>RESET ALL</strong>
                  </Button>
                </div>
              </Form>
              <hr className="labels-divider" />
              <div className="copy-row" style={{ marginTop: 8 }}>
                <div style={{ display: "flex", width: "100%", gap: 8 }}>
                  <Button
                    variant="secondary"
                    onClick={async () => {
                      try {
                        const values: string[] = [];
                        for (let col = 0; col < COLS; col++) {
                          for (let row = 0; row < ROWS; row++) {
                            const idx = row * COLS + col;
                            const v = cells[idx];
                            if (v && v !== "") values.push(v);
                          }
                        }
                        const text = values.join(delimiter);
                        await navigator.clipboard.writeText(text);
                        createToast("Labels copied to clipboard", 1);
                      } catch (err) {
                        createToast("Failed to copy labels to clipboard", 0);
                      }
                    }}
                    style={{ flex: 1, padding: "10px 12px" }}
                  >
                    Copy labels to clipboard
                  </Button>

                  <Form.Control
                    type="text"
                    value={delimiter}
                    onChange={(e: any) => setDelimiter(e.target.value)}
                    placeholder=", "
                    style={{ flex: 1 }}
                  />
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card className="labels-card">
            <Card.Body className="labels-card-body export-card-body">
              <div className="export-buttons">
                <div className="export-pair">
                  <Button
                    variant="outline-primary"
                    onClick={() => exportCsv(false)}
                  >
                    Export CSV
                  </Button>
                  <Button
                    variant="outline-primary"
                    onClick={() => exportCsv(true)}
                  >
                    Export CSV w/ filler
                  </Button>
                </div>
                <div className="export-pair">
                  <Button
                    variant="outline-success"
                    onClick={() => exportXlsx(false)}
                  >
                    Export XLSX
                  </Button>
                  <Button
                    variant="outline-success"
                    onClick={() => exportXlsx(true)}
                  >
                    Export XLSX w/ filler
                  </Button>
                </div>
                <div className="export-pair">
                  <Button
                    variant="outline-info"
                    onClick={() => exportXml(false)}
                  >
                    Export XML
                  </Button>
                  <Button
                    variant="outline-info"
                    onClick={() => exportXml(true)}
                  >
                    Export XML w/ filler
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>

        <Card
          className="labels-grid-card"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          <Card.Body
            style={{
              padding: 16,
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <div className="labels-grid-container">
              <div className="labels-grid">
                {cells.map((c, i) => {
                  const highlight = i === nextIndexForDisplay;
                  const classes = `labels-cell ${highlight ? "highlight" : ""}`;

                  if (editingIndex === i) {
                    return (
                      <div key={i} className={classes}>
                        <input
                          className="labels-edit-input"
                          autoFocus
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          onBlur={() => saveEdit(i)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              saveEdit(i);
                            } else if (e.key === "Escape") {
                              setEditingIndex(null);
                              setEditingValue("");
                            }
                          }}
                        />
                      </div>
                    );
                  }

                  return (
                    <div
                      key={i}
                      className={classes}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setTargetIndex(i);
                      }}
                      onClick={() => {
                        setEditingIndex(i);
                        setEditingValue(c);
                      }}
                    >
                      {c || ""}
                    </div>
                  );
                })}
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Labels;
