# Dashboard App
Frontend react web page for a dashboard application 

## LEAVING OFF
1. Changing nav, instead of offcanvas to just be a normal element that has width, changes dashboard and its childrens width when toggled
2. Navbar to be a context instead? Each widget has it's own version of a navbar, standard Dashboard home/close button at top, but rest is custom
3. Update homepage as well of course
4. UPDATE NAVBAR, ALWAYS SHOWING, TAKING UP SIDE OF PAGE INSTEAD OF HIDDEN, can close it still

### THOUGHTS
1. Separate routes file that holds all routes for use
2. Add 'widgets' & 'userPreferences' Tables to dashboard db instead of profileUserData, widgets keeps a json object of what widgets the user has on dashboard as well as order, userPreferences for things like darkmode, location (for weather api?), etc.
3. Use of refreshToken for axios instance
4. Update error handling for more accurate errors from backend
5. Update CSS for all widgets
6. Implement ErrorBoundry and JSDoc for currently implemented widgets and going forward
7. CSS for mobile first going forward with widgets

### CHARGEN
* Possible Change - update localStorage for what to store for less api calls
* Nav bar has names of other profiles to load easily?
* 

### WORDLE


### EXPENSE TRACKER


### NAVBAR
* Depending on widget to show other information?
