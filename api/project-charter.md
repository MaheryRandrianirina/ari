### Must have features
    1. Registration :
        - username
        - password
        - status (developper, admin)
    2. Authentication :
        - username
        - password
    3. Admin creates the backlog, assigns tasks, and validates user registration
     - All users are listed in the dashboard and could be deleted, expand the user by clicking on the username to check list of his tasks [v]
     - New users to be checked are listed with button to check him [v]
     - Only users with role have been checked [v]
     - All tasks are listed with the name of user assigned to
     - Not assigned tasks are listed with button to assign a user (click on the button open a search bar to search for the user)
    
    4. User checks tasks list then notice advancement in a gauge
     - User could switch task status by moving it toward every status block 
     - User is able to mark task(in progress) advancement by gauge (converted to % or ratio)


NOTE : 
 -- Must change get method in userController : move the actual logic to the authController then implement logic to only get user by _id [v]
 -- All places that must be modified are marked by "[x]" [v]

# NEXT THINGS TO DO :
- Wrap the api call inside util func [v]
- Delete setToken and token props in every component [v]