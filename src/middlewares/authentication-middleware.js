function isValidUser(authorizedValue, userValue) {
  if (userValue === authorizedValue)
    return true;
  else
    return false;
}

function isCurrentUser(paramsID, userID) {
  if (paramsID === userID)
    return true;
  else 
    return false;
}

export function isValidAdminEmployeeOrCurrentUser() {
  return (request, response, next) => {
    if (isValidUser("admin", request.session.userRole) || isValidUser("employee", request.session.userRole) || isCurrentUser(request.params.id, request.session.userID))
      next();
    else 
      response.status(401).send("Unauthorized");
  };  
}

export function isValidAdminOrEmployee() {
  return (request, response, next) => {
    if (isValidUser("admin", request.session.userRole) || isValidUser("employee", request.session.userRole))
      next();
    else 
      response.status(401).send("Unauthorized");
  };  
}

export const isAdminEmployeeOrCurrentUser = isValidAdminEmployeeOrCurrentUser();
export const isAdminOrEmployee = isValidAdminOrEmployee();