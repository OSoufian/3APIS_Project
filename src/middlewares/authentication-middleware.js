function isValidUser(authorizedValue, userValue) {
  if (userValue === authorizedValue)
    return true;
  else
    return false;
}

export function isValidAdminOrEmployee() {
  return (request, response, next) => {
    if (isValidUser("admin", request.session.userRole) || isValidUser("employee", request.session.userRole))
      next();
    else 
      response.status(401).send("Vous n'avez pas les autorisations nécessaires pour effectuer cette action !");
  };  
}

export function isValidAdmin() {
  return (request, response, next) => {
    if (isValidUser("admin", request.session.userRole))
      next();
    else 
      response.status(401).send("Vous n'avez pas les autorisations nécessaires pour effectuer cette action !");
  };  
}

export function getCurrentUser() {
  return (request, response, next) => {
    const id = request.session.userID;
    if (!id) {
      response.status(404).send("Aucun utilisateur connecté !");
      return;
    } else {
      next();
    }
  };  
}

export const isAdminOrEmployee = isValidAdminOrEmployee();
export const isAdmin = isValidAdmin();
export const isCurrentUser = getCurrentUser();