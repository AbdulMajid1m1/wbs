import HttpStatus from 'http-status';
import jwtHelper from '../helpers/jwt_Token.js';
import { pool1, pool2 } from "../config/connection.js"; // import pool1 and pool2 from connection.js file
import sql from "mssql";
pool1.connect().catch((err) => console.log("Error connecting to config1:", err));
pool2.connect().catch((err) => console.log("Error connecting to config2:", err));


const checkAuthentication = async (req, res, next) => {
  try {
    const token = getToken(req) // function to retrieve the token from header|query|body

    let verifiedToken = await jwtHelper.verifyToken(token); // Check whether JWT token is valid or not 
    // if verify token is valid then save the token in req object
    req.token = verifiedToken;
    return next();

  } catch (error) {
    return res.status(401).json({ // If JWT token is not valid, return error message
      message: 'Invalid Token.',
      https: HttpStatus.UNAUTHORIZED,
    });
  }
  // return next(); // remove this line after uncommenting above code
};

const getToken = (req) => {
  let token = '';
  let authorization = req.headers.authorization || req.headers['authorization'] || req.query.token;

  // Accepts token from browser cookies as well
  if (req.cookies && req.cookies.token) {
    authorization = req.cookies.token;
  }

  // Retrieve token from HTTP-only cookie
  if (!authorization && req.cookies && req.cookies.accessToken) {
    authorization = req.cookies.accessToken;
  }

  if (!authorization) {
    throw new Error('Token is not provided.');
  }

  const parts = authorization.split(' ');
  if (parts.length === 2) {
    if (!(/^Bearer$/i.test(parts[0]))) {
      throw new Error('Token is not properly formatted.');
    }
    token = parts[1];
  }
  else {
    token = authorization;
  }

  return token;
};



// Middleware function to check user roles
const checkRole = (roleNames) => {
  return async (req, res, next) => {
    const userId = req?.token?.UserID;

    try {


      // User is not an admin, continue with role-based authorization check
      // Fetch user roles from the database
      const userRoles = await fetchUserRolesFromDatabase(userId);
      // check if userRoles contain Admin role
      const isAdmin = userRoles.includes('Admin');
      if (isAdmin) {
        return next();
      }

      // Check if any of the user's roleNames match the allowed roleNames
      const isAuthorized = userRoles.some(roleName => roleNames.includes(roleName));

      if (!isAuthorized) {
        return res.status(403).json({ message: 'Not authorized to access this resource' });
      }

      // User is authorized, proceed to the next middleware or route handler
      next();

    } catch (error) {
      console.error('Error checking user roles:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
};



const fetchIsAdminFromDatabase = async (userId) => {
  const isAdminQuery = 'SELECT IsAdmin FROM tblUsers WHERE UserID = @userId';

  let request = pool2.request();
  request.input('userId', sql.NVarChar, userId);

  const result = await request.query(isAdminQuery);
  console.log('result: ');
  console.log(result);

  // Extract the isAdmin value from the result
  const isAdmin = result.recordset[0].IsAdmin;
  if (isAdmin == 1) {
    return true;
  };
  return false;
};



// Implementation of fetchUserRolesFromDatabase
const fetchUserRolesFromDatabase = async (userId) => {
  const userRolesQuery = 'SELECT RoleName FROM tblUserRolesAssigned WHERE UserID = @userId';

  let request = pool2.request();
  request.input('userId', sql.NVarChar, userId);

  const result = await request.query(userRolesQuery);
  console.log('result: ');
  console.log(result);

  // Extract the role names from the result
  const userRoles = result.recordset.map(row => row.RoleName);

  return userRoles;
};






export {
  checkAuthentication,
  checkRole,
};
