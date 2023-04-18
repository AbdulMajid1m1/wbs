// using mssql .....................................................................................
import jwt from "jsonwebtoken";
import sql from "mssql";
import config from "../config/dbconfig.js";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });
let jwtSecret = process.env.JWT_SECRET;
let jwtExpiration = process.env.JWT_EXPIRATION;
//get all data
function generateUpdateQuery(fields, tableName) {
  const updateFields = Object.keys(fields)
    .map((key) => `${key}=@${key}`)
    .join(",");

  return `UPDATE ${tableName} SET ${updateFields}`;
}
const FATSDB = {
  async getStats(req, res, next) {
    let totalusers = 0;
    let totalassets = 0;
    let verifiedAssets = 0;
    try {
      console.log("mssql hitting");
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .query("select * from dbo.TblAssetMasterEncodeAssetCapture");

      if (data.rowsAffected[0] != 0) {
        let listdata = data.recordsets[0];
        totalassets = listdata.length;
      }
      let data2 = await pool
        .request()
        .query("select * from dbo.TblAssetMasterEncodeAssetCaptureFinal");

      if (data2.rowsAffected[0] != 0) {
        let listdata2 = data2.recordsets[0];
        verifiedAssets = listdata2.length;
      }
      let data3 = await pool.request().query("select * from dbo.TblUsers");

      if (data3.rowsAffected[0] != 0) {
        let listdata3 = data3.recordsets[0];
        totalusers = listdata3.length;
      }
      return res.status(200).send({
        totalusers: totalusers,
        totalassets: totalassets,
        verifiedAssets: verifiedAssets,
      });

    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },



  async postCompanyData(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .query("select * from dbo.TblCompanyData");
      // if table is empty, insert data otherwise update data
      if (data.rowsAffected[0] == 0) {
        let data = await pool
          .request()
          .input("companyNameEn", sql.VarChar, req.body.companyNameEn)
          .input("companyNameAr", sql.VarChar, req.body.companyNameAr)
          .input("companyAddress", sql.VarChar, req.body.companyAddress)
          .input("crNumber", sql.VarChar, req.body.crNumber)
          .input("companyGPSLocation", sql.VarChar, req.body.companyGPSLocation)
          .input("landlineNumber", sql.VarChar, req.body.landlineNumber)
          // get log form req.file and save it in database using multer and save it path in database
          .input("logo", sql.VarChar, req.file.path)
          .query(
            "INSERT INTO dbo.TblCompanyData (companyNameEn,companyNameAr,companyAddress,crNumber,companyGPSLocation,landlineNumber,logo) VALUES (@companyNameEn,@companyNameAr,@companyAddress,@crNumber,@companyGPSLocation,@landlineNumber,@logo)"
          );
        return res.status(200).send("data inserted");
      } else {
        // Prepare data for updating fields
        const updateData = {
          companyNameEn: req.body.companyNameEn,
          companyNameAr: req.body.companyNameAr,
          companyAddress: req.body.companyAddress,
          crNumber: req.body.crNumber,
          companyGPSLocation: req.body.companyGPSLocation,
          landlineNumber: req.body.landlineNumber,
          logo: req.file && req.file.path,
        };

        // Remove undefined fields
        Object.keys(updateData).forEach((key) => {
          if (updateData[key] === undefined) {
            delete updateData[key];
          }
        });

        // Create request with inputs
        const request = pool.request();
        for (const key in updateData) {
          request.input(key, sql.VarChar, updateData[key]);
        }

        // Generate dynamic update query
        const updateQuery = generateUpdateQuery(updateData, "dbo.TblCompanyData");

        let data = await request.query(updateQuery);
        return res.status(200).send("data updated");
      }
    } catch (e) {
      console.log(e);
      return res.status(500).send({ error: e.message });
    }
  },

  async getCompanyData(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool

        .request()
        .query("select * from dbo.TblCompanyData");
      if (data.rowsAffected[0] == 0) return res.status(404).send("no data available");
      let listdata = data.recordsets[0];
      console.log(listdata);
      return res.send(listdata);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e)
    }
  },
  async GetLogoImage(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool

        .request()
        .query("select logo from dbo.TblCompanyData");
      if (data.rowsAffected[0] == 0) return res.status(404).send("no data available");
      let listdata = data.recordsets[0];
      console.log(listdata);
      return res.status(200).send(listdata);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },

  async getAllAssetMasterEncodeAssetCapture(req, res, next) {
    try {
      console.log("mssql hitting");
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .query("select * from dbo.TblAssetMasterEncodeAssetCapture");

      if (data.rowsAffected[0] == 0) return res.status(404).send("no data available");
      let listdata = data.recordsets[0];
      console.log(listdata);
      return res.send(listdata);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async getAllAssetMasterEncodeAssetCaptureWithNoTag(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request()
        .query("SELECT * FROM dbo.TblAssetMasterEncodeAssetCapture WHERE TagNumber IS NULL OR TagNumber=''"); // select TagNumber where the value is empty or null
      if (data.rowsAffected[0] == 0) return res.status(404).send("no data available");
      let listdata = data.recordsets[0];
      console.log(listdata);
      return res.send(listdata);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },

  async getAllAssetMasterEncodeAssetCaptureFinal(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .query("select * from dbo.TblAssetMasterEncodeAssetCaptureFinal");
      if (data.rowsAffected[0] == 0) return res.status(404).send("no data available");
      let listdata = data.recordsets[0];
      console.log(listdata);
      return res.send(listdata);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async getAssetMasterEncodeAssetCaptureFinalByEmpId(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .query("select * from dbo.TblAssetMasterEncodeAssetCaptureFinal where EMPLOYEEID = '" + req.params.id + "'");
      if (data.rowsAffected[0] == 0) return res.status(404).send("no data available");
      let listdata = data.recordsets[0];
      console.log(listdata);
      return res.send(listdata);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async getAssetMasterEncodeAssetCaptureFinalByLocationTag(req, res, next) {
    try {
      const pool = await sql.connect(config);
      const data = await pool.request().query(`
        SELECT * FROM dbo.TblAssetMasterEncodeAssetCaptureFinal
        WHERE LocationTag LIKE '%${req.params.tag}%'
      `);
      if (data.rowsAffected[0] == 0) {
        return res.status(404).send("no data available");
      }
      const listdata = data.recordsets[0];
      console.log(listdata);
      return res.send(listdata);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  }
  ,
  async getAllEmployeeList(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .query("select * from dbo.TblEmployeeList");
      if (data.rowsAffected[0] == 0) return res.status(404).send("no data available");
      let listdata = data.recordsets[0];
      console.log(listdata);
      return res.send(listdata);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async getAllNewDepartmentLit(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .query("select * from TblNewDepartmentLit");
      if (data.rowsAffected[0] == 0) return res.status(404).send("no data available");
      let listdata = data.recordsets[0];
      console.log(listdata);
      return res.send(listdata);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async getAllusers(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query("select * from TblUsers");
      if (data.rowsAffected[0] == 0) return res.status(404).send("no data available");
      let listdata = data.recordsets[0];
      console.log(listdata);
      return res.send(listdata);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  //   async UserLoginAuth(req, res) {
  //     try {
  //       const { loginname, loginpass } = req.body;
  //       const user = await db.TblUsers.findOne({
  //         where: { loginname, loginpass },
  //       });
  //       if (user) {
  //         res.send({ success: true });
  //       } else {
  //         res.send({ success: false });
  //       }
  //     } catch (err) {
  //       res.send({ success: false });
  //     }
  //   },
  async UserLoginAuth(req, res, next) {
    try {

      let token;
      let tokenPayload;
      const { loginname, loginpass } = req.body;
      const pool = await sql.connect(config);
      const result = await pool
        .request()
        .query(
          `SELECT * FROM TblUsers WHERE loginname='${loginname}' AND loginpass='${loginpass}'`
        );

      if (result.recordset.length > 0) {

        // fetch roles assign to user on the basis of loginname

        let data = await pool
          .request()
          .input("loginname", sql.VarChar, loginname)
          .query(`select * from TblUsersRolesAssigned where UserLoginID=@loginname`);

        if (data.rowsAffected[0] != 0) {

          let listdata = data.recordsets[0];
          console.log(listdata);
          const assignedRoles = listdata.map(item => item.RoleID);
          console.log(assignedRoles);
          tokenPayload = {
            userloginId: loginname,
            assignedRoles: assignedRoles,
          };
          console.log(tokenPayload);

        }
        else {
          tokenPayload = {
            userloginId: loginname,
            assignedRoles: [],
          }
        }
        token = jwt.sign(
          tokenPayload,
          jwtSecret,
          { expiresIn: jwtExpiration })
        console.log(token)

        if (!token) return res.status(500).send({ success: false, message: 'Token not generated' });
        // return res.cookie("token", token, {
        //   // httpOnly: true,
        // }).
        res.status(200).send({ success: true, user: result.recordset, token: token })
      } else {
        return res.status(400).send({ success: false, message: 'Invalid Credentials' });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send({ success: false, message: 'Internal Server Error', error: err });
    }
  },

  async getAllRegion(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query("select * from TblRegion");
      if (data.rowsAffected[0] == 0) return res.status(404).send("no data available");
      let listdata = data.recordsets[0];
      console.log(listdata);
      return res.send(listdata);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async getAllCity(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query("select * from TblCity");
      if (data.rowsAffected[0] == 0) return res.status(404).send("no data available");
      let listdata = data.recordsets[0];
      console.log(listdata);
      return res.send(listdata);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async getAllCityMaster(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query("select * from TblCityMaster");
      if (data.rowsAffected[0] == 0) return res.status(404).send("no data available");
      let listdata = data.recordsets[0];
      console.log(listdata);
      return res.send(listdata);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async getAllAssetRequestMaster(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .query("select * from TblAssetRequestMaster");
      if (data.rowsAffected[0] == 0) return res.status(404).send("no data available");
      let listdata = data.recordsets[0];
      console.log(listdata);
      return res.send(listdata);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async getAllAssetRequestDetails(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .query("select * from TblAssetRequestDetails");
      if (data.rowsAffected[0] == 0) return res.status(404).send("no data available");
      let listdata = data.recordsets[0];
      console.log(listdata);
      return res.send(listdata);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async getAllAssetCondition(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query("select * from TblAssetCondition");
      if (data.rowsAffected[0] == 0) return res.status(404).send("no data available");
      let listdata = data.recordsets[0];
      console.log(listdata);
      return res.send(listdata);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async getAllAssetConditionBought(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query("select * from TblAssetConditionBought");
      if (data.rowsAffected[0] == 0) return res.status(404).send("no data available");
      let listdata = data.recordsets[0];
      console.log(listdata);
      return res.send(listdata);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async getAllMAINCATEGORY(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query("select * from TblMAINCATEGORY");
      if (data.rowsAffected[0] == 0) return res.status(404).send("no data available");
      let listdata = data.recordsets[0];
      console.log(listdata);
      return res.send(listdata);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async getAllMAINSUBSeriesNo(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query("select * from TblMAINSUBSeriesNo");
      if (data.rowsAffected[0] == 0) return res.status(404).send("no data available");
      let listdata = data.recordsets[0];
      console.log(listdata);
      return res.send(listdata);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async getAllmakelist(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query("select * from TblMakeList");
      if (data.rowsAffected[0] == 0) return res.status(404).send("no data available");
      let listdata = data.recordsets[0];
      console.log(listdata);
      return res.send(listdata);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async getAllMAINSUBSeriesNoAssigned(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .query("select * from TblMAINSUBSeriesNoAssigned");
      if (data.rowsAffected[0] == 0) return res.status(404).send("no data available");
      let listdata = data.recordsets[0];
      console.log(listdata);
      return res.send(listdata);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async getAllCountry(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .query(`select * from  [dbo].[TblCountry]`);
      if (data.rowsAffected[0] == 0) return res.status(404).send("no data available");
      let listdata = data.recordsets[0];
      console.log(listdata);
      return res.send(listdata);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async getAllInvJournalMaster(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .query("select * from TblInvJournalMaster");
      if (data.rowsAffected[0] == 0) return res.status(404).send("no data available");
      let listdata = data.recordsets[0];
      console.log(listdata);
      return res.send(listdata);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async getAllLocationTags(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query("select * from TblLocationTags");
      if (data.rowsAffected[0] == 0) return res.status(404).send("no data available");
      let listdata = data.recordsets[0];
      console.log(listdata);
      return res.send(listdata);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async getAllUsersRoles(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query("select * from TblUsersRoles");
      if (data.rowsAffected[0] == 0) return res.status(404).send("no data available");
      let listdata = data.recordsets[0];
      console.log(listdata);
      return res.send(listdata);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async getAllUsersRolesAssigned(req, res, next) {
    try {

      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .query("select * from TblUsersRolesAssigned ");
      if (data.rowsAffected[0] == 0) return res.status(404).send("no data available");
      let listdata = data.recordsets[0];
      console.log(listdata);
      return res.send(listdata);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async getAllUsersRolesAssignedToUser(req, res, next) {
    try {
      console.log("see")
      console.log(req.token)
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("UserLoginID", sql.VarChar, req.params.UserLoginID)
        .query("select * from TblUsersRolesAssigned where UserLoginID=@UserLoginID");
      if (data.rowsAffected[0] == 0) return res.status(404).send("no data available");
      let listdata = data.recordsets[0];
      console.log(listdata);
      return res.status(200).send(listdata);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },

  async getAllUsersDepartment(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query("select * from TblUsersDepartment");
      if (data.rowsAffected[0] == 0) return res.status(404).send("no data available");
      let listdata = data.recordsets[0];
      console.log(listdata);
      return res.send(listdata);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async getAllFloors(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query("select * from TblFloors");
      if (data.rowsAffected[0] == 0) return res.status(404).send("no data available");
      let listdata = data.recordsets[0];
      console.log(listdata);
      return res.send(listdata);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async getAllAssetsPhoto(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query("select * from TblAssetsPhoto");
      if (data.rowsAffected[0] == 0) return res.status(404).send("no data available");
      let listdata = data.recordsets[0];
      console.log(listdata);
      return res.send(listdata);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  // get by id
  async getAssetMasterEncodeAssetCaptureById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("TagNumber", sql.VarChar, req.body.TagNumber)
        .query(
          "select * from TblAssetMasterEncodeAssetCapture where TagNumber=@TagNumber"
        );
      console.log(data?.rowsAffected[0]);
      if (data?.rowsAffected[0] != 0) return res.status(200).send(data);
      else return res.status(404).send("no data available");
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },

  async UpdateAssetMasterEncodeAssetCaptureTagNumber(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .query(
          "SELECT * FROM TblAssetMasterEncodeAssetCapture WHERE TagNumber IS NULL OR TagNumber = ''"
        );
      let listdata = data.recordsets[0];

      // Generate tag numbers and update them in the database
      for (const element of listdata) {
        let mainSubseriesnoResult = await pool
          .request()
          .query(
            `SELECT MainSubSeriesNo FROM TblMAINSUBSeriesNo WHERE MainCategoryCode = ${element.MajorCategory === null
              ? "NULL"
              : `'${element.MajorCategory}'`
            } AND SubCategoryCode = ${element.MInorCategory === null
              ? "NULL"
              : `'${element.MInorCategory}'`
            }`
          );
        let mainSubseriesno =
          mainSubseriesnoResult.recordset[0]?.MainSubSeriesNo ?? 33333;

        await pool
          .request()
          .query(
            `UPDATE TblMAINSUBSeriesNo SET MainSubSeriesNo = ${mainSubseriesno + 1
            } WHERE MainCategoryCode = ${element.MajorCategory === null
              ? "NULL"
              : `'${element.MajorCategory}'`
            } AND SubCategoryCode = ${element.MInorCategory === null
              ? "NULL"
              : `'${element.MInorCategory}'`
            }`
          );

        let MainCategoryCode = element.MajorCategory;
        let SubcategoryCode = element.MInorCategory;
        let tagNumber = null;

        if (MainCategoryCode !== null && SubcategoryCode !== null) {
          tagNumber =
            MainCategoryCode.toString() +
            SubcategoryCode.toString() +
            mainSubseriesno.toString();

          // If the length of tagNumber is less than 12, add leading zeros
          while (tagNumber.length < 12) {
            let insertIndex = Math.min(
              tagNumber.length,
              MainCategoryCode.toString().length +
              SubcategoryCode.toString().length
            );

            tagNumber =
              tagNumber.slice(0, insertIndex) +
              "0" +
              tagNumber.slice(insertIndex);
          }
        }

        await pool
          .request()
          .query(
            `UPDATE TblAssetMasterEncodeAssetCapture SET TagNumber = ${tagNumber !== null ? `'${tagNumber}'` : "NULL"
            } WHERE TblAssetMasterEncodeAssetCaptureID = ${element.TblAssetMasterEncodeAssetCaptureID
            }`
          );
      }

      return res.status(200).send("Tags updated successfully.");
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async getAssetMasterEncodeAssetCaptureFinalById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("TagNumber", sql.VarChar, req.body.TagNumber)
        .query(
          "select * from TblAssetMasterEncodeAssetCaptureFinal where TagNumber=@TagNumber"
        );
      console.log(data);
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async getEmployeeListById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("EmpID", sql.VarChar, req.body.EmpID)
        .query("select * from TblEmployeeList where EmpID=@EmpID");
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async getNewDepartmentLitById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("DAONumber", sql.VarChar, req.body.DAONumber)
        .query("select * from TblNewDepartmentLit  where DAONumber=@DAONumber");
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async getUsersById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("loginname", sql.VarChar, req.body.loginname)
        .query("select * from TblUsers where loginname=@loginname");
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async getRegionById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("RegionCode", sql.VarChar, req.body.RegionCode)
        .query("select * from TblRegion where RegionCode=@RegionCode");
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async getCityById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("CityCode", sql.VarChar, req.body.CityCode)
        .query("select * from TblCity where CityCode=@CityCode");
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async getCityMasterById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("CountryCode", sql.VarChar, req.body.CountryCode)
        .query("select * from TblCityMaster where CountryCode=@CountryCode");
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async getAssetRequestMasterById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("RequestNo", sql.VarChar, req.body.RequestNo)
        .query(
          "select * from TblAssetRequestMaster where RequestNo=@RequestNo"
        );
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async getAssetRequestDetailsById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("RequestNo", sql.VarChar, req.body.RequestNo)
        .query(
          "select * from TblAssetRequestDetails where RequestNo=@RequestNo"
        );
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async getAssetConditionById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("TblAssetConditionID", sql.VarChar, req.body.TblAssetConditionID)
        .query(
          "select * from TblAssetCondition where TblAssetConditionID=@TblAssetConditionID"
        );
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async getMAINCATEGORYById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("TblMAINSUBSeriesNoID", sql.Int, req.body.TblMAINSUBSeriesNoID)
        .query(
          "select * from TblMAINCATEGORY	 where TblMAINSUBSeriesNoID=@TblMAINSUBSeriesNoID"
        );
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async getMAINSUBSeriesNoById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("TblMAINSUBSeriesNoID", sql.Int, req.body.TblMAINSUBSeriesNoID)
        .query(
          "select * from TblMAINSUBSeriesNo where TblMAINSUBSeriesNoID=@TblMAINSUBSeriesNoID"
        );
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async getMakeListById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("TblMakeMainCode", sql.Int, req.body.TblMakeMainCode)
        .input("tblMajorCode", sql.Int, req.body.tblMajorCode)

        .query(
          // "select * from  TblMakeList where TblMakeMainCode=@TblMakeMainCode"
          "select * from  TblMakeList where TblMakeMainCode=@TblMakeMainCode and tblMajorCode=@tblMajorCode"
        );
      console.log(data);
      return res.status(200).send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },

  //err
  async getMAINSUBSeriesNoAssignedById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("UserLoginID", sql.VarChar, req.body.UserLoginID)
        .query(
          "select * from TblMAINSUBSeriesNoAssigned where UserLoginID=@UserLoginID"
        );
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async getCountryById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("TblCountryID", sql.Int, req.body.TblCountryID)
        .query(
          `Select * from [dbo].[TblCountry] where TblCountryID=@TblCountryID`
        );
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async getInvJournalMasterById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input(
          "TblInvJournalMasterID",
          sql.VarChar,
          req.body.TblInvJournalMasterID
        )
        .query(
          "select * from TblInvJournalMaster where TblInvJournalMasterID=@TblInvJournalMasterID"
        );
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async getLocationTagsById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("TblLocationTagsID", sql.VarChar, req.body.TblLocationTagsID)
        .query(
          "select * from TblLocationTags where TblLocationTagsID=@TblLocationTagsID"
        );
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async getUsersRolesById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("TblUsersRolesID", sql.VarChar, req.body.TblUsersRolesID)
        .query(
          "select * from TblUsersRoles where TblUsersRolesID=@TblUsersRolesID"
        );
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async getUsersRolesAssignedById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("TblUsersRolesID", sql.VarChar, req.body.TblUsersRolesID)
        .query(
          "select * from  TblUsersRolesAssigned where TblUsersRolesID=@TblUsersRolesID"
        );
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async getUsersDepartmentById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input(
          "TblUsersDepartmentID",
          sql.VarChar,
          req.body.TblUsersDepartmentID
        )
        .query(
          "select * from TblUsersDepartment where TblUsersDepartmentID=@TblUsersDepartmentID"
        );
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async getFloorsById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("TblFloorsID", sql.VarChar, req.body.TblFloorsID)
        .query("select * from TblFloors where TblFloorsID=@TblFloorsID");
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async getAssetsPhotoById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("PhotoTagNo", sql.VarChar, req.body.PhotoTagNo).query(`SELECT *
            FROM [FATSDB].[dbo].[TblAssetsPhoto] where PhotoTagNo = @PhotoTagNo`);
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  //delete by id
  async deleteAssetMasterEncodeAssetCaptureById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("TagNumber", sql.VarChar, req.body.TagNumber)
        .query(
          "delete from TblAssetMasterEncodeAssetCapture where TagNumber=@TagNumber"
        );
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async deleteAssetMasterEncodeAssetCaptureFinalById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("TagNumber", sql.VarChar, req.body.TagNumber)
        .query(
          "delete from TblAssetMasterEncodeAssetCaptureFinal where TagNumber=@TagNumber"
        );
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async deleteEmployeeListById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("EmpID", sql.VarChar, req.body.EmpID)
        .query("delete from TblEmployeeList	 where EmpID=@EmpID");
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async deleteNewDepartmentLitById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("DAONumber", sql.VarChar, req.body.DAONumber)
        .query("Delete  from  TblNewDepartmentLit  where DAONumber=@DAONumber");
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async deleteUsersById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("loginname", sql.VarChar, req.body.loginname)
        .query("delete from TblUsers where loginname=@loginname");
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async deleteRegionById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("RegionCode", sql.VarChar, req.body.RegionCode)
        .query("delete from TblRegion where RegionCode=@RegionCode");
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async deleteCityById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("CityCode", sql.VarChar, req.body.CityCode)
        .query("delete from TblCity	 where CityCode=@CityCode");
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async deleteCityMasterById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("CountryCode", sql.VarChar, req.body.CountryCode)
        .query("delete  from TblCityMaster where CountryCode=@CountryCode");
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async deleteAssetRequestMasterById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("RequestNo", sql.VarChar, req.body.RequestNo)
        .query("delete from TblAssetRequestMaster where RequestNo=@RequestNo");
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async deleteAssetRequestDetailsById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("RequestNo", sql.VarChar, req.body.RequestNo)
        .query("delete from TblAssetRequestDetails where RequestNo=@RequestNo");
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async deleteAssetConditionById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("TblAssetConditionID", sql.VarChar, req.body.TblAssetConditionID)
        .query(
          "delete from TblAssetCondition where TblAssetConditionID=@TblAssetConditionID"
        );
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async deleteMAINCATEGORYById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("TblMAINSUBSeriesNoID", sql.Int, req.body.TblMAINSUBSeriesNoID)
        .query(
          "delete from TblMAINCATEGORY	 where TblMAINSUBSeriesNoID=@TblMAINSUBSeriesNoID"
        );
      console.log(data);
      if (data.rowsAffected[0] === 0) {
        return res.status(404).send("No record found");
      }
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async deleteMAINSUBSeriesNoById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("TblMAINSUBSeriesNoID", sql.Int, req.body.TblMAINSUBSeriesNoID)
        .query(
          "delete TblMAINSUBSeriesNo where TblMAINSUBSeriesNoID=@TblMAINSUBSeriesNoID"
        );
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async deleteMakeListById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("TblMakeListID", sql.Int, req.body.TblMakeListID)
        .query("delete from  TblMakeList where TblMakeListID=@TblMakeListID");
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async deleteMAINSUBSeriesNoAssignedById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("UserLoginID", sql.VarChar, req.body.UserLoginID)
        .query(
          "delete from TblMAINSUBSeriesNoAssigned where UserLoginID=@UserLoginID"
        );
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async deleteCountryById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("TblCountryID", sql.Int, req.body.TblCountryID)
        .query(
          `delete from [dbo].[TblCountry] where TblCountryID=@TblCountryID`
        );
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async deleteInvJournalMasterById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input(
          "TblInvJournalMasterID",
          sql.VarChar,
          req.body.TblInvJournalMasterID
        )
        .query(
          "delete from TblInvJournalMaster where TblInvJournalMasterID=@TblInvJournalMasterID"
        );
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async deleteLocationTagsById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("TblLocationTagsID", sql.Int, req.body.TblLocationTagsID)
        .query(
          "delete from TblLocationTags where TblLocationTagsID=@TblLocationTagsID"
        );
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async deleteUsersRolesById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("TblUsersRolesID", sql.VarChar, req.body.TblUsersRolesID)
        .query(
          "delete from TblUsersRoles where TblUsersRolesID=@TblUsersRolesID"
        );
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async deleteUsersRolesAssignedById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("RoleID", sql.VarChar, req.body.RoleID)
        .input("UserLoginID", sql.VarChar, req.body.UserLoginID)
        .query(
          "delete from  TblUsersRolesAssigned where RoleID=@RoleID and UserLoginID=@UserLoginID"
        );
      console.log(data);
      console.log("roleID", req.body.RoleID);
      console.log("UserLoginID", req.body.UserLoginID);
      if (data.rowsAffected[0] === 0) {
        return res.status(404).send("No record found");
      }
      return res.status(200).send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async deleteUsersDepartmentById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input(
          "TblUsersDepartmentID",
          sql.VarChar,
          req.body.TblUsersDepartmentID
        )
        .query(
          "delete from TblUsersDepartment where TblUsersDepartmentID=@TblUsersDepartmentID"
        );
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async deleteFloorsById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("TblFloorsID", sql.VarChar, req.body.TblFloorsID)
        .query("select * from TblFloors where TblFloorsID=@TblFloorsID");
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async deleteAssetsPhotoById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("PhotoTagNo", sql.VarChar, req.body.PhotoTagNo)
        .query("delete from TblAssestsPhoto where PhotoTagNo=@PhotoTagNo");
      console.log(data);
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  // post data
  async postAssetMasterEncodeAssetCapture(req, res, next) {
    try {
      let currentDate = new Date();
      let dateFormat = currentDate.toISOString().slice(0, 10);
      let timeFormat = currentDate.toLocaleTimeString();


      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("MainSubSeriesNo", sql.Numeric, req.body.MainSubSeriesNo)
        .input("QTY", sql.Numeric, req.body.QTY)
        .input("MajorCategory", sql.VarChar, req.body.MajorCategory)
        .input(
          "MajorCategoryDescription",
          sql.VarChar,
          req.body.MajorCategoryDescription
        )
        .input("MInorCategory", sql.VarChar, req.body.MInorCategory)
        .input(
          "MinorCategoryDescription",
          sql.VarChar,
          req.body.MinorCategoryDescription
        )
        .input("TagNumber", sql.VarChar, req.body.TagNumber)
        .input("sERIALnUMBER", sql.VarChar, req.body.sERIALnUMBER)
        .input("aSSETdESCRIPTION", sql.VarChar, req.body.aSSETdESCRIPTION)
        .input("assettYPE", sql.VarChar, req.body.assettYPE)
        .input("aSSETcONDITION", sql.VarChar, req.body.aSSETcONDITION)
        .input("cOUNTRY", sql.VarChar, req.body.cOUNTRY)
        .input("rEGION", sql.VarChar, req.body.rEGION)
        .input("CityName", sql.VarChar, req.body.CityName)
        .input("Dao", sql.VarChar, req.body.Dao)
        .input("DaoName", sql.VarChar, req.body.DaoName)
        .input("BUILDINGNO", sql.VarChar, req.body.BUILDINGNO)
        .input("FLOORNO", sql.VarChar, req.body.FLOORNO)
        .input("EMPLOYEEID", sql.VarChar, req.body.EMPLOYEEID)
        .input("ponUmber", sql.VarChar, req.body.ponUmber)
        .input("Podate", sql.VarChar, req.body.Podate)
        .input("DeliveryNoteNo", sql.VarChar, req.body.DeliveryNoteNo)
        .input("Supplier", sql.VarChar, req.body.Supplier)
        .input("InvoiceNo", sql.VarChar, req.body.InvoiceNo)
        .input("InvoiceDate", sql.VarChar, req.body.InvoiceDate)
        .input("ModelofAsset", sql.VarChar, req.body.ModelofAsset)
        .input("Manufacturer", sql.VarChar, req.body.Manufacturer)
        .input("Ownership", sql.VarChar, req.body.Ownership)
        .input("Bought", sql.VarChar, req.body.Bought)
        .input("TerminalID", sql.VarChar, req.body.TerminalID)
        .input("ATMNumber", sql.VarChar, req.body.ATMNumber)
        .input("LocationTag", sql.VarChar, req.body.LocationTag)
        .input("buildingName", sql.VarChar, req.body.buildingName)
        .input("buildingAddress", sql.VarChar, req.body.buildingAddress)
        .input("UserLoginID", sql.VarChar, req.body.UserLoginID)
        .input("PhoneExtNo", sql.VarChar, req.body.PhoneExtNo)
        .input("assetdatecaptured", sql.VarChar, dateFormat)
        .input("assetTimeCaptured", sql.VarChar, timeFormat)
        .input("assetdatescanned", sql.VarChar, req.body.assetdatescanned)
        .input("assettimeScanned", sql.VarChar, req.body.assettimeScanned)
        .input("FullLocationDetails", sql.VarChar, req.body.FullLocationDetails)
        .input("BusinessUnit", sql.VarChar, req.body.BusinessUnit)

        .query(
          `
            INSERT INTO [dbo].[TblAssetMasterEncodeAssetCapture]
                       ([MajorCategory]
                       ,[MajorCategoryDescription]
                       ,[MInorCategory]
                       ,[MinorCategoryDescription]
                       ,[TagNumber]
                       ,[sERIALnUMBER]
                       ,[aSSETdESCRIPTION]
                       ,[assettYPE]
                       ,[aSSETcONDITION]
                       ,[cOUNTRY]
                       ,[rEGION]
                       ,[CityName]
                       ,[Dao]
                       ,[DaoName]
                       ,[BusinessUnit]
                       ,[BUILDINGNO]
                       ,[FLOORNO]
                       ,[EMPLOYEEID]
                       ,[ponUmber]
                       ,[Podate]
                       ,[DeliveryNoteNo]
                       ,[Supplier]
                       ,[InvoiceNo]
                       ,[InvoiceDate]
                       ,[ModelofAsset]
                       ,[Manufacturer]
                       ,[Ownership]
                       ,[Bought]
                       ,[TerminalID]
                       ,[ATMNumber]
                       ,[LocationTag]
                       ,[buildingName]
                       ,[buildingAddress]
                       ,[UserLoginID]
                       ,[MainSubSeriesNo]
                       ,[assetdatecaptured]
                       ,[assetTimeCaptured]
                       ,[assetdatescanned]
                       ,[assettimeScanned]
                       ,[QTY]
                       ,[PhoneExtNo]
                       ,[FullLocationDetails]
                       )
                 VALUES
                       (@MajorCategory
                       ,@MajorCategoryDescription
                       ,@MInorCategory
                       ,@MinorCategoryDescription
                       ,@TagNumber
                       ,@sERIALnUMBER
                       ,@aSSETdESCRIPTION
                       ,@assettYPE
                       ,@aSSETcONDITION
                       ,@cOUNTRY
                       ,@rEGION
                       ,@CityName
                       ,@Dao
                       ,@DaoName
                       ,@BusinessUnit
                       ,@BUILDINGNO
                       ,@FLOORNO
                       ,@EMPLOYEEID
                       ,@ponUmber
                       ,@Podate
                       ,@DeliveryNoteNo
                       ,@Supplier
                       ,@InvoiceNo
                       ,@InvoiceDate
                       ,@ModelofAsset
                       ,@Manufacturer
                       ,@Ownership
                       ,@Bought
                       ,@TerminalID
                       ,@ATMNumber
                       ,@LocationTag
                       ,@buildingName
                       ,@buildingAddress
                       ,@UserLoginID
                       ,@MainSubSeriesNo
                       ,@assetdatecaptured
                       ,@assetTimeCaptured
                       ,@assetdatescanned
                       ,@assettimeScanned
                       ,@QTY
                       ,@PhoneExtNo
                       ,@FullLocationDetails
                       )
            `
        );

      console.log(data);
      return res.status(200).send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async postAssetMasterEncodeAssetCaptureFinal(req, res, next) {
    try {
      let currentDate = new Date();
      let dateFormat = currentDate.toISOString().slice(0, 10);
      let timeFormat = currentDate.toLocaleTimeString();

      let images = "";
      if (req.files && req.files.length > 0) {
        // concatenate the paths of the uploaded images
        images = req.files.map(file => file.path).join(",");
        // do something with the concatenated paths

      }
      console.log(images)



      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("Images", sql.VarChar, images)
        .input("MainSubSeriesNo", sql.Numeric, req.body.MainSubSeriesNo)
        .input("QTY", sql.Numeric, req.body.QTY)
        .input("MajorCategory", sql.VarChar, req.body.MajorCategory)
        .input(
          "MajorCategoryDescription",
          sql.VarChar,
          req.body.MajorCategoryDescription
        )
        .input("MInorCategory", sql.VarChar, req.body.MInorCategory)
        .input(
          "MinorCategoryDescription",
          sql.VarChar,
          req.body.MinorCategoryDescription
        )
        .input("TagNumber", sql.VarChar, req.body.TagNumber)
        .input("sERIALnUMBER", sql.VarChar, req.body.sERIALnUMBER)
        .input("aSSETdESCRIPTION", sql.VarChar, req.body.aSSETdESCRIPTION)
        .input("assettYPE", sql.VarChar, req.body.assettYPE)
        .input("aSSETcONDITION", sql.VarChar, req.body.aSSETcONDITION)
        .input("cOUNTRY", sql.VarChar, req.body.cOUNTRY)
        .input("rEGION", sql.VarChar, req.body.rEGION)
        .input("CityName", sql.VarChar, req.body.CityName)
        .input("Dao", sql.VarChar, req.body.Dao)
        .input("DaoName", sql.VarChar, req.body.DaoName)
        .input("BUILDINGNO", sql.VarChar, req.body.BUILDINGNO)
        .input("FLOORNO", sql.VarChar, req.body.FLOORNO)
        .input("EMPLOYEEID", sql.VarChar, req.body.EMPLOYEEID)
        .input("ponUmber", sql.VarChar, req.body.ponUmber)
        .input("Podate", sql.VarChar, req.body.Podate)
        .input("DeliveryNoteNo", sql.VarChar, req.body.DeliveryNoteNo)
        .input("Supplier", sql.VarChar, req.body.Supplier)
        .input("InvoiceNo", sql.VarChar, req.body.InvoiceNo)
        .input("InvoiceDate", sql.VarChar, req.body.InvoiceDate)
        .input("ModelofAsset", sql.VarChar, req.body.ModelofAsset)
        .input("Manufacturer", sql.VarChar, req.body.Manufacturer)
        .input("Ownership", sql.VarChar, req.body.Ownership)
        .input("Bought", sql.VarChar, req.body.Bought)
        .input("TerminalID", sql.VarChar, req.body.TerminalID)
        .input("ATMNumber", sql.VarChar, req.body.ATMNumber)
        .input("LocationTag", sql.VarChar, req.body.LocationTag)
        .input("buildingName", sql.VarChar, req.body.buildingName)
        .input("buildingAddress", sql.VarChar, req.body.buildingAddress)
        .input("UserLoginID", sql.VarChar, req.body.UserLoginID)
        .input("PhoneExtNo", sql.VarChar, req.body.PhoneExtNo)
        .input("assetdatecaptured", sql.VarChar, req.body.assetdatecaptured)
        .input("assetTimeCaptured", sql.VarChar, req.body.assetTimeCaptured)
        .input("assetdatescanned", sql.VarChar, dateFormat)
        .input("assettimeScanned", sql.VarChar, timeFormat)
        .input("FullLocationDetails", sql.VarChar, req.body.FullLocationDetails)
        .input("JournalRefNo", sql.VarChar, req.body.JournalRefNo)
        .input("BusinessUnit", sql.VarChar, req.body.BusinessUnit)
        .query(
          `
            INSERT INTO [dbo].[TblAssetMasterEncodeAssetCaptureFinal]
                       (  [MajorCategory]
                       ,[MajorCategoryDescription]
                       ,[MInorCategory]
                       ,[MinorCategoryDescription]
                       ,[TagNumber]
                       ,[sERIALnUMBER]
                       ,[aSSETdESCRIPTION]
                       ,[assettYPE]
                       ,[aSSETcONDITION]
                       ,[cOUNTRY]
                       ,[rEGION]
                       ,[CityName]
                       ,[Dao]
                       ,[DaoName]
                       ,[BusinessUnit]
                       ,[BUILDINGNO]
                       ,[FLOORNO]
                       ,[EMPLOYEEID]
                       ,[ponUmber]
                       ,[Podate]
                       ,[DeliveryNoteNo]
                       ,[Supplier]
                       ,[InvoiceNo]
                       ,[InvoiceDate]
                       ,[ModelofAsset]
                       ,[Manufacturer]
                       ,[Ownership]
                       ,[Bought]
                       ,[TerminalID]
                       ,[ATMNumber]
                       ,[LocationTag]
                       ,[buildingName]
                       ,[buildingAddress]
                       ,[UserLoginID]
                       ,[MainSubSeriesNo]
                       ,[assetdatecaptured]
                       ,[assetTimeCaptured]
                       ,[assetdatescanned]
                       ,[assettimeScanned]
                       ,[QTY]
                       ,[PhoneExtNo]
                       ,[FullLocationDetails]
                       ,[JournalRefNo],
                       [Images]
                       )
                 VALUES
                       (@MajorCategory
                       ,@MajorCategoryDescription
                       ,@MInorCategory
                       ,@MinorCategoryDescription
                       ,@TagNumber
                       ,@sERIALnUMBER
                       ,@aSSETdESCRIPTION
                       ,@assettYPE
                       ,@aSSETcONDITION
                       ,@cOUNTRY
                       ,@rEGION
                       ,@CityName
                       ,@Dao
                       ,@DaoName
                       ,@BusinessUnit
                       ,@BUILDINGNO
                       ,@FLOORNO
                       ,@EMPLOYEEID
                       ,@ponUmber
                       ,@Podate
                       ,@DeliveryNoteNo
                       ,@Supplier
                       ,@InvoiceNo
                       ,@InvoiceDate
                       ,@ModelofAsset
                       ,@Manufacturer
                       ,@Ownership
                       ,@Bought
                       ,@TerminalID
                       ,@ATMNumber
                       ,@LocationTag
                       ,@buildingName
                       ,@buildingAddress
                       ,@UserLoginID
                       ,@MainSubSeriesNo
                       ,@assetdatecaptured
                       ,@assetTimeCaptured
                       ,@assetdatescanned
                       ,@assettimeScanned
                       ,@QTY
                       ,@PhoneExtNo
                       ,@FullLocationDetails
                       ,@JournalRefNo
                       ,@Images)
            `
        );

      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async postEmployeeList(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("EmpID", sql.VarChar, req.body.EmpID)
        .input("EmpName", sql.VarChar, req.body.EmpName)
        .input("EmpRegion", sql.VarChar, req.body.EmpRegion)
        .input("EmpUnit", sql.VarChar, req.body.EmpUnit)
        .input("EmpDivision", sql.VarChar, req.body.EmpDivision)
        .query(
          `
            INSERT INTO [dbo].[TblEmployeeList]
                       ([EmpID]
                       ,[EmpName]
                       ,[EmpRegion]
                       ,[EmpUnit]
                       ,[EmpDivision])
                 VALUES
                       (@EmpID
                       ,@EmpName
                       ,@EmpRegion
                       ,@EmpUnit
                       ,@EmpDivision)
            `
        );

      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async postNewDepartmentLit(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("branchcode", sql.VarChar, req.body.branchcode)
        .input("DAONumber", sql.VarChar, req.body.DAONumber)
        .input("BusinessUnit", sql.VarChar, req.body.BusinessUnit)
        .input("BUSINESSGROUP", sql.VarChar, req.body.BUSINESSGROUP)
        .input("HRMapping", sql.VarChar, req.body.HRMapping)
        .input("DaoName", sql.VarChar, req.body.DaoName)
        .input("DaoArea", sql.VarChar, req.body.DaoArea).query(`
        INSERT INTO [dbo].[TblNewDepartmentLit]
           ([branchcode]
           ,[DAONumber]
           ,[BusinessUnit]
           ,[BUSINESSGROUP]
           ,[HRMapping]
           ,[DaoName]
           ,[DaoArea])
     VALUES
           (@branchcode
           ,@DAONumber
           ,@BusinessUnit
           ,@BUSINESSGROUP
           ,@HRMapping
           ,@DaoName
           ,@DaoArea)
        `);

      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  // async postusers(req, res, next) {
  //   try {
  //     let pool = await sql.connect(config);
  //     let data = await pool
  //       .request()
  //       .input("loginname", sql.VarChar, req.body.loginname)
  //       .input("loginpass", sql.VarChar, req.body.loginpass)
  //       .input("loginfullname", sql.VarChar, req.body.loginfullname)
  //       .input("branchcode", sql.VarChar, req.body.branchcode)
  //       .input("adminaccess", sql.TinyInt, req.body.adminaccess)
  //       .input("TRXNewAssets", sql.TinyInt, req.body.TRXNewAssets)
  //       .input("TRXExistingAssets", sql.TinyInt, req.body.TRXExistingAssets)
  //       .input("TRXInventory", sql.TinyInt, req.body.TRXInventory)
  //       .input(
  //         "TRXassetMovementInternalTransfer",
  //         sql.TinyInt,
  //         req.body.TRXassetMovementInternalTransfer
  //       )
  //       .input(
  //         "TRXAssetMovementforRepair",
  //         sql.TinyInt,
  //         req.body.TRXAssetMovementforRepair
  //       )
  //       .input(
  //         "TRXAssetMovementforDisposed",
  //         sql.TinyInt,
  //         req.body.TRXAssetMovementforDisposed
  //       )
  //       .input(
  //         "TRXAssetMovementforReturns",
  //         sql.TinyInt,
  //         req.body.TRXAssetMovementforReturns
  //       )
  //       .input(
  //         "TRXAssetTagGenerateEnable",
  //         sql.TinyInt,
  //         req.body.TRXAssetTagGenerateEnable
  //       )
  //       .input(
  //         "TRXAssetTagPrintingAllow",
  //         sql.TinyInt,
  //         req.body.TRXAssetTagPrintingAllow
  //       )
  //       .input(
  //         "TRXAllowImportExternalFile",
  //         sql.TinyInt,
  //         req.body.TRXAllowImportExternalFile
  //       ).query(`
  //       INSERT INTO [dbo].[TblUsers]
  //          ([loginname]
  //          ,[loginpass]
  //          ,[loginfullname]
  //          ,[branchcode]
  //          ,[adminaccess]
  //          ,[TRXNewAssets]
  //          ,[TRXExistingAssets]
  //          ,[TRXInventory]
  //          ,[TRXassetMovementInternalTransfer]
  //          ,[TRXAssetMovementforRepair]
  //          ,[TRXAssetMovementforDisposed]
  //          ,[TRXAssetMovementforReturns]
  //          ,[TRXAssetTagGenerateEnable]
  //          ,[TRXAssetTagPrintingAllow]
  //          ,[TRXAllowImportExternalFile])
  //    VALUES
  //          (@loginname
  //          ,@loginpass
  //          ,@loginfullname
  //          ,@branchcode
  //          ,@adminaccess
  //          ,@TRXNewAssets
  //          ,@TRXExistingAssets
  //          ,@TRXInventory
  //          ,@TRXassetMovementInternalTransfer
  //          ,@TRXAssetMovementforRepair
  //          ,@TRXAssetMovementforDisposed
  //          ,@TRXAssetMovementforReturns
  //          ,@TRXAssetTagGenerateEnable
  //          ,@TRXAssetTagPrintingAllow
  //          ,@TRXAllowImportExternalFile)`);
  //     console.log(data);
  //     // const userLoginId = data.recordset[0].UserLoginID;
  //     // console.log(userLoginId);
  //     return res.send(data);
  //   } catch (e) {
  //     console.log(e);
  //     return res.status(500).send(e);
  //   }
  // },
  // async postusers(req, res, next) {
  //   try {
  //     let pool = await sql.connect(config);
  //     let data = await pool

  //       .request()
  //       .input("loginname", sql.VarChar, req.body.loginname)
  //       .input("loginpass", sql.VarChar, req.body.loginpass)
  //       .input("loginfullname", sql.VarChar, req.body.loginfullname)
  //       .input("branchcode", sql.VarChar, req.body.branchcode)
  //       .input("adminaccess", sql.TinyInt, req.body.adminaccess)
  //       .input("TRXNewAssets", sql.TinyInt, req.body.TRXNewAssets)
  //       .input("TRXExistingAssets", sql.TinyInt, req.body.TRXExistingAssets)
  //       .input("TRXInventory", sql.TinyInt, req.body.TRXInventory)
  //       .input("TRXAllowImportExternalFile", sql.TinyInt, req.body.TRXAllowImportExternalFile)
  //       .query(`
  //       INSERT INTO [dbo].[TblUsers]
  //         ([loginname], [loginpass], [loginfullname], [branchcode], [adminaccess], [TRXNewAssets], [TRXExistingAssets], [TRXInventory], [TRXAllowImportExternalFile])
  //         VALUES
  //         (@loginname, @loginpass, @loginfullname, @branchcode, @adminaccess, @TRXNewAssets, @TRXExistingAssets, @TRXInventory, @TRXAllowImportExternalFile)`);

  //     console.log(data);

  //     // Get the inserted user's ID
  //     // const userLoginId = data.recordset[0].UserLoginID;
  //     // get user login id from body
  //     const userLoginId = req.body.loginname;

  //     // Define the roles
  //     const roles = [
  //       // ... (keep your existing roles objects)
  //       {
  //         "TblUsersRolesID": 30,
  //         "RoleID": 10,
  //         "RoleDescription": "TRXassetMovementInternalTransfer"
  //       },
  //       {
  //         "TblUsersRolesID": 31,
  //         "RoleID": 11,
  //         "RoleDescription": "TRXAssetMovementforRepair"
  //       },
  //       {
  //         "TblUsersRolesID": 32,
  //         "RoleID": 12,
  //         "RoleDescription": "TRXAssetMovementforDisposed"
  //       },
  //       {
  //         "TblUsersRolesID": 33,
  //         "RoleID": 13,
  //         "RoleDescription": "TRXAssetMovementforReturns"
  //       },
  //       {
  //         "TblUsersRolesID": 34,
  //         "RoleID": 14,
  //         "RoleDescription": "TRXAssetTagGenerateEnable"
  //       },
  //       {
  //         "TblUsersRolesID": 35,
  //         "RoleID": 15,
  //         "RoleDescription": "TRXAssetTagPrintingAllow"
  //       },
  //       {
  //         "TblUsersRolesID": 36,
  //         "RoleID": 16,
  //         "RoleDescription": "TRXAllowImportExternalFile"
  //       }
  //     ];
  //   //   {
  //   //     "RoleID":"3",
  //   //     "RoleDescription":"FATSCLIENT: Able to do the Inventory Count",
  //   //     "UserLoginID":"55"
  //   // }

  //     // Check if any permission is equal to 1 and add the corresponding role in tblroleassigned
  //     roles.forEach(async role => {
  //       if (req.body[role.RoleDescription] === 1) {
  //         await pool
  //           .request()
  //           .input("UserLoginID", sql.VarChar, userLoginId)
  //           .input("RoleID", sql.Int, role.RoleID)
  //           .query(`
  //           INSERT INTO [dbo].[TblRoleAssigned]
  //             ([UserLoginID], [RoleID])
  //             VALUES
  //             (@UserLoginID, @RoleID)`);
  //       }
  //     });



  //     return res.send(data);
  //   } catch (e) {
  //     console.log(e);
  //     return res.status(500).send(e);
  //   }
  // },
  async postusers(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("loginname", sql.VarChar, req.body.loginname)
        .input("loginpass", sql.VarChar, req.body.loginpass)
        .input("loginfullname", sql.VarChar, req.body.loginfullname)
        .input("branchcode", sql.VarChar, req.body.branchcode)
        .input("adminaccess", sql.TinyInt, req.body.adminaccess)
        .input("email", sql.VarChar, req.body.email)
        .input("phoneNumber", sql.VarChar, req.body.phoneNumber)
        // .input("TRXNewAssets", sql.TinyInt, req.body.TRXNewAssets)
        // .input("TRXExistingAssets", sql.TinyInt, req.body.TRXExistingAssets)
        // .input("TRXInventory", sql.TinyInt, req.body.TRXInventory)
        // .input("TRXAllowImportExternalFile", sql.TinyInt, req.body.TRXAllowImportExternalFile)
        .query(`
        INSERT INTO [dbo].[TblUsers]
          ([loginname], [loginpass], [loginfullname], [branchcode], [adminaccess],[email],[phoneNumber])
          VALUES
          (@loginname, @loginpass, @loginfullname, @branchcode, @adminaccess, @email, @phoneNumber)`);

      console.log(data);

      const userLoginId = req.body.loginname;

      const roles = [
        // ... (keep your existing roles objects)
        {
          "TblUsersRolesID": 21,
          "RoleID": 1,
          "RoleDescription": "Full Admin",
          "inputName": "adminaccess"

        },
      ];

      for (const role of roles) {
        if (req.body[role.inputName] === 1) {
          // Check if the role is already assigned to the user
          let checkData = await pool
            .request()
            .input("RoleID", sql.Numeric, role.RoleID)
            .input("UserLoginID", sql.VarChar, userLoginId)
            .query(`
              SELECT * FROM [dbo].[TblUsersRolesAssigned]
              WHERE [RoleID] = @RoleID AND [UserLoginID] = @UserLoginID
            `);
          console.log(checkData);


          if (checkData.recordset.length === 0) {
            await pool
              .request()
              .input("RoleID", sql.Numeric, role.RoleID)
              .input("RoleDescription", sql.VarChar, role.RoleDescription)
              .input("UserLoginID", sql.VarChar, userLoginId)
              .query(`
              INSERT INTO [dbo].[TblUsersRolesAssigned]
                ([RoleID], [RoleDescription], [UserLoginID])
                VALUES
                (@RoleID, @RoleDescription, @UserLoginID)`);
          }
        }
      }

      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async postRegion(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("RegionCode", sql.VarChar, req.body.RegionCode)
        .input("RegionName", sql.VarChar, req.body.RegionName).query(`
        INSERT INTO [dbo].[TblRegion]
           ([RegionCode]
           ,[RegionName])
     VALUES
           (@RegionCode
           ,@RegionName)
        `);

      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async postCity(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("CityCode", sql.VarChar, req.body.CityCode)
        .input("CityName", sql.VarChar, req.body.CityName)
        .input("RegionCode", sql.VarChar, req.body.RegionCode).query(`
        INSERT INTO [dbo].[TblCity]
           ([CityCode]
           ,[CityName]
           ,[RegionCode])
     VALUES
           (@CityCode
           ,@CityName
           ,@RegionCode)`);

      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async postCityMaster(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("CountryCode", sql.VarChar, req.body.CountryCode)
        .input("CountryName", sql.VarChar, req.body.CountryName)
        .input("RegionCode", sql.VarChar, req.body.RegionCode)
        .input("RegionName", sql.VarChar, req.body.RegionName)
        .input("CityCode", sql.VarChar, req.body.CityCode)
        .input("CityName", sql.VarChar, req.body.CityName).query(`
        INSERT INTO [dbo].[TblCityMaster]
           ([CountryCode]
           ,[CountryName]
           ,[RegionCode]
           ,[RegionName]
           ,[CityCode]
           ,[CityName])
     VALUES
           (@CountryCode
                       ,@CountryName

           ,@RegionCode
                      ,@RegionName

           ,@CityCode
                      ,@CityName
           )
        `);

      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async postAssetRequestMaster(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("TypeofRequest", sql.VarChar, req.body.TypeofRequest)
        .input("DateRequested", sql.VarChar, req.body.DateRequested)
        .input("RequestedBy", sql.VarChar, req.body.RequestedBy)
        .input(
          "UserLoginIDcurrentLogon",
          sql.VarChar,
          req.body.UserLoginIDcurrentLogon
        )
        .input(
          "ApprovingDepartmentCode",
          sql.VarChar,
          req.body.ApprovingDepartmentCode
        )
        .input(
          "AssetCurrentLocationDetails",
          sql.VarChar,
          req.body.AssetCurrentLocationDetails
        ).query(`
        
INSERT INTO [dbo].[TblAssetRequestMaster]
([TypeofRequest]
,[DateRequested]
,[RequestedBy]
,[UserLoginIDcurrentLogon]
,[ApprovingDepartmentCode]
,[AssetCurrentLocationDetails])
VALUES
(@TypeofRequest
,@DateRequested
,@RequestedBy
,@UserLoginIDcurrentLogon
,@ApprovingDepartmentCode
,@AssetCurrentLocationDetails)
        `);
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async postAssetRequestDetails(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("RequestNo", sql.VarChar, req.body.RequestNo)
        .input("TypeofRequest", sql.VarChar, req.body.TypeofRequest)
        .input("DateRequested", sql.VarChar, req.body.DateRequested)
        .input("RequestedBy", sql.VarChar, req.body.RequestedBy)
        .input(
          "UserLoginIDcurrentLogon",
          sql.VarChar,
          req.body.UserLoginIDcurrentLogon
        )
        .input(
          "ApprovingDepartmentCode",
          sql.VarChar,
          req.body.ApprovingDepartmentCode
        )
        .input("TagNumberPicked", sql.VarChar, req.body.TagNumberPicked)
        .input("aSSETdESCRIPTION", sql.VarChar, req.body.aSSETdESCRIPTION)
        .input("DateScannedPicked", sql.VarChar, req.body.DateScannedPicked)
        .input("SERIALNOS1", sql.VarChar, req.body.SERIALNOS1)
        .input("DaoCity", sql.VarChar, req.body.DaoCity)
        .input("DaoArea", sql.VarChar, req.body.DaoArea)
        .input("DAOBU", sql.VarChar, req.body.DAOBU)
        .input("Dao", sql.VarChar, req.body.Dao).query(`
        INSERT INTO [dbo].[TblAssetRequestDetails
        ]
                   ([RequestNo]
                   ,[TypeofRequest]
                   ,[DateRequested]
                   ,[RequestedBy]
                   ,[UserLoginIDcurrentLogon]
                   ,[ApprovingDepartmentCode]
                   ,[TagNumberPicked]
                   ,[aSSETdESCRIPTION]
                   ,[DateScannedPicked]
                   ,[SERIALNOS1]
                   ,[DaoCity]
                   ,[DaoArea]
                   ,[DAOBU]
                   ,[Dao])
             VALUES
                   (@RequestNo
                   ,@TypeofRequest
                   ,@DateRequested
                   ,@RequestedBy
                   ,@UserLoginIDcurrentLogon
                   ,@ApprovingDepartmentCode
                   ,@TagNumberPicked
                   ,@aSSETdESCRIPTION
                   ,@DateScannedPicked
                   ,@SERIALNOS1
                   ,@DaoCity
                   ,@DaoArea
                   ,@DAOBU
                   ,@Dao)
        
        `);

      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async postAssetCondition(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("TblConditionCode", sql.VarChar, req.body.TblConditionCode)
        .input(
          "TblConditionDescription",
          sql.VarChar,
          req.body.TblConditionDescription
        ).query(`
        INSERT INTO [dbo].[TblAssetCondition]
           ([TblConditionCode]
           ,[TblConditionDescription])
     VALUES
           (@TblConditionCode
           ,@TblConditionDescription)
        `);
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async postMAINCATEGORY(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("MainCategoryCode", sql.VarChar, req.body.MainCategoryCode)
        .input("MainDescription", sql.VarChar, req.body.MainDescription).query(`
        
INSERT INTO [dbo].[TblMAINCATEGORY]
([MainCategoryCode]
,[MainDescription])
VALUES
(@MainCategoryCode
,@MainDescription)
`);
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },

  async postMAINSUBSeriesNo(req, res, next) {
    let transaction;

    try {
      const pool = await sql.connect(config);
      transaction = new sql.Transaction(pool);
      await transaction.begin();

      const request = new sql.Request(transaction);
      const data = req.body.data;

      for (let i = 0; i < data.length; i++) {
        const record = data[i];

        // Check if the record already exists
        const checkRecordExists = await request
          .input(`MainCategoryCode${i}`, sql.VarChar, record.MainCategoryCode)
          .input(`SubCategoryCode${i}`, sql.VarChar, record.SubCategoryCode)
          .input(`SubDescription${i}`, sql.VarChar, record.SubDescription)
          .query(`
          SELECT * FROM [dbo].[TblMAINSUBSeriesNo]
          WHERE [SubCategoryCode] = @SubCategoryCode${i} AND [MainCategoryCode] = @MainCategoryCode${i} `);

        console.log(checkRecordExists.recordset.length);

        if (checkRecordExists.recordset.length > 0) {
          await transaction.commit();
          return res.status(400).send({
            message: 'Category already exists',
            record: {
              index: i,
              data: record
            }
          });
        }

        // Check if SubDescription is unique within the same MainCategoryCode and SubCategoryCode
        const checkSubDescriptionUnique = await request
          .query(`
          SELECT * FROM [dbo].[TblMAINSUBSeriesNo]
          WHERE [SubDescription] = @SubDescription${i}`);

        if (checkSubDescriptionUnique.recordset.length > 0) {
          await transaction.commit();
          return res.status(400).send({
            message: 'SubDescription already exists for this MainCategoryCode and SubCategoryCode',
            record: {
              index: i,
              data: record
            }
          });
        }

        await request
          .input(`SeriesNumber${i}`, sql.Numeric, record.SeriesNumber)
          .input(`MainSubSeriesNo${i}`, sql.Numeric, record.MainSubSeriesNo)
          .input(`MainDescription${i}`, sql.VarChar, record.MainDescription)
          // .input(`SubDescription${i}`, sql.VarChar, record.SubDescription)
          .query(`
            INSERT INTO [dbo].[TblMAINSUBSeriesNo]
            ([MainCategoryCode]
            ,[SubCategoryCode]
            ,[MainSubSeriesNo]
            ,[MainDescription]
            ,[SubDescription]
            ,[SeriesNumber])
            VALUES
            (@MainCategoryCode${i}
            ,@SubCategoryCode${i}
            ,@MainSubSeriesNo${i}
            ,@MainDescription${i}
            ,@SubDescription${i}
            ,@SeriesNumber${i})
          `);
      }

      await transaction.commit();
      console.log("Data inserted successfully.");
      return res.sendStatus(200);
    } catch (e) {
      console.log(e);
      await transaction.rollback();
      return res.status(500).send(e);
    } finally {
      sql.close();
    }
  },


  async postMakeList(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("TblMakeName", sql.VarChar, req.body.TblMakeName)
        .input("TblMakeMainCode", sql.VarChar, req.body.TblMakeMainCode)
        .input("tblMajorCode", sql.VarChar, req.body.tblMajorCode).query(`
        
          INSERT INTO [dbo].[TblMakeList]
          ([TblMakeName]
          ,[TblMakeMainCode]
          ,[tblMajorCode])
          VALUES
          (@TblMakeName
          ,@TblMakeMainCode
          ,@tblMajorCode)`);

      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async postMAINSUBSeriesNoAssigned(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("MainCategoryCode", sql.Numeric, req.body.MainCategoryCode)
        .input("SeriesNumber", sql.Numeric, req.body.SeriesNumber)
        .input("MainSubSeriesNo", sql.VarChar, req.body.MainSubSeriesNo)
        .input("MainDescription", sql.VarChar, req.body.MainDescription)
        .input("SubDescription", sql.VarChar, req.body.SubDescription)
        .input("SubCategoryCode", sql.VarChar, req.body.SubCategoryCode)
        .input("UserLoginID", sql.VarChar, req.body.UserLoginID)
        .input("DeptCode", sql.VarChar, req.body.DeptCode).query(`
        INSERT INTO [dbo].[TblMAINSUBSeriesNoAssigned]
           ([MainCategoryCode]
           ,[SubCategoryCode]
           ,[MainSubSeriesNo]
           ,[MainDescription]
           ,[SubDescription]
           ,[SeriesNumber]
           ,[UserLoginID]
           ,[DeptCode])
     VALUES
           (@MainCategoryCode
                     ,@SubCategoryCode
                     ,@MainSubSeriesNo
                       ,@MainDescription
                       ,@SubDescription
                       ,@SeriesNumber
                       ,@UserLoginID
                     ,@DeptCode )`);

      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async postCountry(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("CountryCode", sql.VarChar, req.body.CountryCode)
        .input("CountryName", sql.VarChar, req.body.CountryName).query(`
        
INSERT INTO [dbo].[TblCountry]
([CountryCode]
,[CountryName])
VALUES
(@CountryCode,@CountryName)
        `);

      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async postInvJournalMaster(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input(
          "JournalSysAutoNumber",
          sql.Numeric,
          req.body.JournalSysAutoNumber
        )
        .input("JournalRefNo", sql.VarChar, req.body.JournalRefNo)
        .input("JournalDateCreated", sql.VarChar, req.body.JournalDateCreated)
        .input("JournalTimeCreated", sql.VarChar, req.body.JournalTimeCreated)
        .input("JournalRemarks", sql.VarChar, req.body.JournalRemarks).query(`
        
INSERT INTO [dbo].[TblInvJournalMaster]
([JournalSysAutoNumber]
,[JournalRefNo]
,[JournalDateCreated]
,[JournalTimeCreated]
,[JournalRemarks])
VALUES
(@JournalSysAutoNumber,
@JournalRefNo,
@JournalDateCreated,
@JournalTimeCreated,
@JournalRemarks)
        `);

      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async postLocationTags(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("LocationTag", sql.VarChar, req.body.LoactionTag)
        .query(`INSERT INTO [dbo].[TblLocationTags]
        ([LocationTag])
  VALUES
        (@LocationTag)`);

      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  // async postUsersRoles(req, res, next) {
  //   try {
  //     let pool = await sql.connect(config);
  //     let data = await pool
  //       .request()
  //       .input("RoleID", sql.Numeric, req.body.RoleID)
  //       .input("RoleDescription", sql.VarChar, req.body.RoleDescription).query(`
  //       INSERT INTO [dbo].[TblUsersRoles]
  //          ([RoleID]
  //          ,[RoleDescription])
  //    VALUES
  //          (@RoleID,
  //           @RoleDescription)

  //       `);

  //     console.log(data);
  //     return res.send("inserted");
  //   } catch (e) {
  //     console.log(e);
  //     return res.status(500).send(e);
  //   }
  // },
  async postUsersRoles(req, res, next) {
    let transaction;

    try {
      const pool = await sql.connect(config);
      transaction = new sql.Transaction(pool);
      await transaction.begin();

      const request = new sql.Request(transaction);
      const data = req.body.data;
      console.log(data);

      for (let i = 0; i < data.length; i++) {
        const record = data[i];
        console.log(record);

        // Check if the RoleID already exists
        const checkRoleExists = await request
          .input(`RoleID${i}`, sql.Numeric, record.RoleID)
          .query(`
          SELECT * FROM [dbo].[TblUsersRoles]
          WHERE [RoleID] = @RoleID${i}`);

        console.log(checkRoleExists.recordset.length);

        if (checkRoleExists.recordset.length > 0) {
          await transaction.commit();
          return res.status(400).send({
            message: 'Role already exists',
            record: {
              index: i,
              data: record
            }
          });
        }

        await request
          // .input("RoleID", sql.Numeric, record.RoleID)
          .input(`RoleDescription${i}`, sql.VarChar, record.RoleDescription)
          .query(`
          INSERT INTO [dbo].[TblUsersRoles]
             ([RoleID]
             ,[RoleDescription])
       VALUES
             (@RoleID${i},
              @RoleDescription${i})

          `);
      }

      await transaction.commit()
      console.log("Data inserted successfully.");
      return res.status(200).send("Data inserted successfully.");
    } catch (e) {
      console.log(e);
      await transaction.rollback();
      return res.status(500).send(e);
    } finally {
      sql.close();
    }
  },


  async postUsersRolesAssigned(req, res, next) {
    try {
      let pool = await sql.connect(config);

      // Check if the role is already assigned to the user
      let checkData = await pool
        .request()
        .input("RoleID", sql.Numeric, req.body.RoleID)
        .input("UserLoginID", sql.VarChar, req.body.UserLoginID)
        .query(`
        SELECT * FROM [dbo].[TblUsersRolesAssigned]
        WHERE ([RoleID] = @RoleID AND [UserLoginID] = @UserLoginID) 
              OR ([RoleID] = 1 AND [UserLoginID] = @UserLoginID)        
        `);

      if (checkData.recordset.length > 0) {
        // The role is already assigned to the user
        return res.status(400).send({
          message: 'Role already assigned to user'
        });
      }

      // Insert the role assignment
      let data = await pool
        .request()
        .input("RoleID", sql.Numeric, req.body.RoleID)
        .input("RoleDescription", sql.VarChar, req.body.RoleDescription)
        .input("UserLoginID", sql.VarChar, req.body.UserLoginID)
        .query(`
          INSERT INTO [dbo].[TblUsersRolesAssigned]
            ([RoleID]
            ,[RoleDescription]
            ,[UserLoginID])
          VALUES
            (@RoleID,
             @RoleDescription,
             @UserLoginID)
        `);

      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async postUsersDepartment(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("DeptCode", sql.VarChar, req.body.DeptCode)
        .input("DepartmentName", sql.VarChar, req.body.DepartmentName).query(`
        INSERT INTO [dbo].[TblUsersDepartment]
           ([DeptCode]
           ,[DepartmentName])
     VALUES
           (@DeptCode,
            @DepartmentName)
        `);

      console.log(data);
      return res.send("inserted");
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async postFloors(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("FLOORNO", sql.VarChar, req.body.FLOORNO)
        .input("FloorName", sql.VarChar, req.body.FloorName).query(`
        INSERT INTO [dbo].[TblFloors]
           ([FLOORNO]
           ,[FloorName])
     VALUES
           (@FLOORNO,
            @FloorName)
        `);

      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async postAssetsPhoto(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("PhotoTagNo", sql.VarChar, req.body.PhotoTagNo)
        .input("AssetPhoto", sql.VarBinary, req.body.AssetPhoto)
        .query(`INSERT INTO [dbo].[TblAssetsPhoto]
            ([PhotoTagNo]
            ,[AssetPhoto])
      VALUES
            (@PhotoTagNo,
            @AssetPhoto)`);

      console.log(data);
      return res.send("inserted");
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  // update by id
  async updateAssetMasterEncodeAssetCaptureById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("MainSubSeriesNo", sql.Numeric, req.body.MainSubSeriesNo)
        .input("QTY", sql.Numeric, req.body.QTY)
        .input("MajorCategory", sql.VarChar, req.body.MajorCategory)
        .input(
          "MajorCategoryDescription",
          sql.VarChar,
          req.body.MajorCategoryDescription
        )
        .input("MInorCategory", sql.VarChar, req.body.MInorCategory)
        .input(
          "MinorCategoryDescription",
          sql.VarChar,
          req.body.MinorCategoryDescription
        )
        .input("TagNumber", sql.VarChar, req.body.TagNumber)
        .input("sERIALnUMBER", sql.VarChar, req.body.sERIALnUMBER)
        .input("aSSETdESCRIPTION", sql.VarChar, req.body.aSSETdESCRIPTION)
        .input("assettYPE", sql.VarChar, req.body.assettYPE)
        .input("aSSETcONDITION", sql.VarChar, req.body.aSSETcONDITION)
        .input("cOUNTRY", sql.VarChar, req.body.cOUNTRY)
        .input("rEGION", sql.VarChar, req.body.rEGION)
        .input("CityName", sql.VarChar, req.body.CityName)
        .input("Dao", sql.VarChar, req.body.Dao)
        .input("DaoName", sql.VarChar, req.body.DaoName)
        .input("BUILDINGNO", sql.VarChar, req.body.BUILDINGNO)
        .input("FLOORNO", sql.VarChar, req.body.FLOORNO)
        .input("EMPLOYEEID", sql.VarChar, req.body.EMPLOYEEID)
        .input("ponUmber", sql.VarChar, req.body.ponUmber)
        .input("Podate", sql.VarChar, req.body.Podate)
        .input("DeliveryNoteNo", sql.VarChar, req.body.DeliveryNoteNo)
        .input("Supplier", sql.VarChar, req.body.Supplier)
        .input("InvoiceNo", sql.VarChar, req.body.InvoiceNo)
        .input("InvoiceDate", sql.VarChar, req.body.InvoiceDate)
        .input("ModelofAsset", sql.VarChar, req.body.ModelofAsset)
        .input("Manufacturer", sql.VarChar, req.body.Manufacturer)
        .input("Ownership", sql.VarChar, req.body.Ownership)
        .input("Bought", sql.VarChar, req.body.Bought)
        .input("TerminalID", sql.VarChar, req.body.TerminalID)
        .input("ATMNumber", sql.VarChar, req.body.ATMNumber)
        .input("LocationTag", sql.VarChar, req.body.LocationTag)
        .input("buildingName", sql.VarChar, req.body.buildingName)
        .input("buildingAddress", sql.VarChar, req.body.buildingAddress)
        .input("UserLoginID", sql.VarChar, req.body.UserLoginID)
        .input("PhoneExtNo", sql.VarChar, req.body.PhoneExtNo)
        .input("assetdatecaptured", sql.VarChar, req.body.assetdatecaptured)
        .input("assetTimeCaptured", sql.VarChar, req.body.assetTimeCaptured)
        .input("assetdatescanned", sql.VarChar, req.body.assetdatescanned)
        .input("assettimeScanned", sql.VarChar, req.body.assettimeScanned)
        .input("FullLocationDetails", sql.VarChar, req.body.FullLocationDetails)
        .input("BusinessUnit", sql.VarChar, req.body.BusinessUnit).query(`
       UPDATE [dbo].[TblAssetMasterEncodeAssetCapture]
   SET [MajorCategory] =@MajorCategory
      ,[MajorCategoryDescription] =@MajorCategoryDescription
      ,[MInorCategory] =@MInorCategory
      ,[MinorCategoryDescription] =@MinorCategoryDescription
  
      ,[sERIALnUMBER] =@sERIALnUMBER
      ,[aSSETdESCRIPTION] =@aSSETdESCRIPTION
      ,[assettYPE] =@assettYPE
      ,[aSSETcONDITION] =@aSSETcONDITION
      ,[cOUNTRY] =@cOUNTRY
      ,[rEGION] =@rEGION
      ,[CityName] =@CityName
      ,[Dao] =@Dao
      ,[DaoName] =@DaoName
      ,[BusinessUnit] =@BusinessUnit
      ,[BUILDINGNO] =@BUILDINGNO
      ,[FLOORNO] =@FLOORNO
      ,[EMPLOYEEID] =@EMPLOYEEID
      ,[ponUmber] =@ponUmber
      ,[Podate] =@Podate
      ,[DeliveryNoteNo] =@DeliveryNoteNo
      ,[Supplier] =@Supplier
      ,[InvoiceNo] =@InvoiceNo
      ,[InvoiceDate] =@InvoiceDate
      ,[ModelofAsset] =@ModelofAsset
      ,[Manufacturer] =@Manufacturer
      ,[Ownership] =@Ownership
      ,[Bought] =@Bought
      ,[TerminalID] =@TerminalID
      ,[ATMNumber] =@ATMNumber
      ,[LocationTag] =@LocationTag
      ,[buildingName] =@buildingName
      ,[buildingAddress] =@buildingAddress
      ,[UserLoginID] =@UserLoginID
      ,[MainSubSeriesNo] =@MainSubSeriesNo
      ,[assetdatecaptured] =@assetdatecaptured
      ,[assetTimeCaptured] =@assetTimeCaptured
      ,[assetdatescanned] =@assetdatescanned
      ,[assettimeScanned] =@assettimeScanned
      ,[QTY] =@QTY
      ,[PhoneExtNo] =@PhoneExtNo
      ,[FullLocationDetails] =@FullLocationDetails
      
 WHERE TagNumber=@TagNumber`);

      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async updateAssetMasterEncodeAssetCaptureFinalById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("MainSubSeriesNo", sql.Numeric, req.body.MainSubSeriesNo)
        .input("QTY", sql.Numeric, req.body.QTY)
        .input("MajorCategory", sql.VarChar, req.body.MajorCategory)
        .input(
          "MajorCategoryDescription",
          sql.VarChar,
          req.body.MajorCategoryDescription
        )
        .input("MInorCategory", sql.VarChar, req.body.MInorCategory)
        .input(
          "MinorCategoryDescription",
          sql.VarChar,
          req.body.MinorCategoryDescription
        )
        .input("TagNumber", sql.VarChar, req.body.TagNumber)
        .input("sERIALnUMBER", sql.VarChar, req.body.sERIALnUMBER)
        .input("aSSETdESCRIPTION", sql.VarChar, req.body.aSSETdESCRIPTION)
        .input("assettYPE", sql.VarChar, req.body.assettYPE)
        .input("aSSETcONDITION", sql.VarChar, req.body.aSSETcONDITION)
        .input("cOUNTRY", sql.VarChar, req.body.cOUNTRY)
        .input("rEGION", sql.VarChar, req.body.rEGION)
        .input("CityName", sql.VarChar, req.body.CityName)
        .input("Dao", sql.VarChar, req.body.Dao)
        .input("DaoName", sql.VarChar, req.body.DaoName)
        .input("BUILDINGNO", sql.VarChar, req.body.BUILDINGNO)
        .input("FLOORNO", sql.VarChar, req.body.FLOORNO)
        .input("EMPLOYEEID", sql.VarChar, req.body.EMPLOYEEID)
        .input("ponUmber", sql.VarChar, req.body.ponUmber)
        .input("Podate", sql.VarChar, req.body.Podate)
        .input("DeliveryNoteNo", sql.VarChar, req.body.DeliveryNoteNo)
        .input("Supplier", sql.VarChar, req.body.Supplier)
        .input("InvoiceNo", sql.VarChar, req.body.InvoiceNo)
        .input("InvoiceDate", sql.VarChar, req.body.InvoiceDate)
        .input("ModelofAsset", sql.VarChar, req.body.ModelofAsset)
        .input("Manufacturer", sql.VarChar, req.body.Manufacturer)
        .input("Ownership", sql.VarChar, req.body.Ownership)
        .input("Bought", sql.VarChar, req.body.Bought)
        .input("TerminalID", sql.VarChar, req.body.TerminalID)
        .input("ATMNumber", sql.VarChar, req.body.ATMNumber)
        .input("LocationTag", sql.VarChar, req.body.LocationTag)
        .input("buildingName", sql.VarChar, req.body.buildingName)
        .input("buildingAddress", sql.VarChar, req.body.buildingAddress)
        .input("UserLoginID", sql.VarChar, req.body.UserLoginID)
        .input("PhoneExtNo", sql.VarChar, req.body.PhoneExtNo)
        .input("assetdatecaptured", sql.VarChar, req.body.assetdatecaptured)
        .input("assetTimeCaptured", sql.VarChar, req.body.assetTimeCaptured)
        .input("assetdatescanned", sql.VarChar, req.body.assetdatescanned)
        .input("assettimeScanned", sql.VarChar, req.body.assettimeScanned)
        .input("FullLocationDetails", sql.VarChar, req.body.FullLocationDetails)
        .input("JournalRefNo", sql.VarChar, req.body.JournalRefNo)
        .input("BusinessUnit", sql.VarChar, req.body.BusinessUnit).query(`
       UPDATE [dbo].[TblAssetMasterEncodeAssetCaptureFinal]
   SET [MajorCategory] =@MajorCategory
      ,[MajorCategoryDescription] =@MajorCategoryDescription
      ,[MInorCategory] =@MInorCategory
      ,[MinorCategoryDescription] =@MinorCategoryDescription
  
      ,[sERIALnUMBER] =@sERIALnUMBER
      ,[aSSETdESCRIPTION] =@aSSETdESCRIPTION
      ,[assettYPE] =@assettYPE
      ,[aSSETcONDITION] =@aSSETcONDITION
      ,[cOUNTRY] =@cOUNTRY
      ,[rEGION] =@rEGION
      ,[CityName] =@CityName
      ,[Dao] =@Dao
      ,[DaoName] =@DaoName
      ,[BusinessUnit] =@BusinessUnit
      ,[BUILDINGNO] =@BUILDINGNO
      ,[FLOORNO] =@FLOORNO
      ,[EMPLOYEEID] =@EMPLOYEEID
      ,[ponUmber] =@ponUmber
      ,[Podate] =@Podate
      ,[DeliveryNoteNo] =@DeliveryNoteNo
      ,[Supplier] =@Supplier
      ,[InvoiceNo] =@InvoiceNo
      ,[InvoiceDate] =@InvoiceDate
      ,[ModelofAsset] =@ModelofAsset
      ,[Manufacturer] =@Manufacturer
      ,[Ownership] =@Ownership
      ,[Bought] =@Bought
      ,[TerminalID] =@TerminalID
      ,[ATMNumber] =@ATMNumber
      ,[LocationTag] =@LocationTag
      ,[buildingName] =@buildingName
      ,[buildingAddress] =@buildingAddress
      ,[UserLoginID] =@UserLoginID
      ,[MainSubSeriesNo] =@MainSubSeriesNo
      ,[assetdatecaptured] =@assetdatecaptured
      ,[assetTimeCaptured] =@assetTimeCaptured
      ,[assetdatescanned] =@assetdatescanned
      ,[assettimeScanned] =@assettimeScanned
      ,[QTY] =@QTY
      ,[PhoneExtNo] =@PhoneExtNo
      ,[FullLocationDetails] =@FullLocationDetails
      ,[JournalRefNo] = @JournalRefNo
 WHERE TagNumber=@TagNumber`);
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async updateEmployeeListById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("EmpID", sql.VarChar, req.body.EmpID)
        .input("EmpName", sql.VarChar, req.body.EmpName)
        .input("EmpRegion", sql.VarChar, req.body.EmpRegion)
        .input("EmpUnit", sql.VarChar, req.body.EmpUnit)
        .input("EmpDivision", sql.VarChar, req.body.EmpDivision)
        .query(
          `UPDATE [dbo].[TblEmployeeList]
            SET 
               [EmpName] = @EmpName
               ,[EmpRegion] = @EmpRegion
               ,[EmpUnit] = @EmpUnit
               ,[EmpDivision] = @EmpDivision
          WHERE EmpID=@EmpID
            `
        );

      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async updateNewDepartmentLitById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("branchcode", sql.VarChar, req.body.branchcode)
        .input("DAONumber", sql.VarChar, req.body.DAONumber)
        .input("BusinessUnit", sql.VarChar, req.body.BusinessUnit)
        .input("BUSINESSGROUP", sql.VarChar, req.body.BUSINESSGROUP)
        .input("HRMapping", sql.VarChar, req.body.HRMapping)
        .input("DaoName", sql.VarChar, req.body.DaoName)
        .input("DaoArea", sql.VarChar, req.body.DaoArea).query(`
        
UPDATE [dbo].[TblNewDepartmentLit]
SET [branchcode] = @branchcode

   ,[BusinessUnit] = @BusinessUnit
   ,[BUSINESSGROUP] = @BUSINESSGROUP
   ,[HRMapping] = @HRMapping
   ,[DaoName] = @DaoName
   ,[DaoArea] = @DaoArea
WHERE  DAONumber=@DAONumber
        `);
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async updateUsersById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("loginname", sql.VarChar, req.body.loginname)
        .input("loginpass", sql.VarChar, req.body.loginpass)
        .input("loginfullname", sql.VarChar, req.body.loginfullname)
        .input("branchcode", sql.VarChar, req.body.branchcode)
        .input("adminaccess", sql.TinyInt, req.body.adminaccess)
        .input("TRXNewAssets", sql.TinyInt, req.body.TRXNewAssets)
        .input("TRXExistingAssets", sql.TinyInt, req.body.TRXExistingAssets)
        .input("TRXInventory", sql.TinyInt, req.body.TRXInventory)
        .input(
          "TRXassetMovementInternalTransfer",
          sql.TinyInt,
          req.body.TRXassetMovementInternalTransfer
        )
        .input(
          "TRXAssetMovementforRepair",
          sql.TinyInt,
          req.body.TRXAssetMovementforRepair
        )
        .input(
          "TRXAssetMovementforDisposed",
          sql.TinyInt,
          req.body.TRXAssetMovementforDisposed
        )
        .input(
          "TRXAssetMovementforReturns",
          sql.TinyInt,
          req.body.TRXAssetMovementforReturns
        )
        .input(
          "TRXAssetTagGenerateEnable",
          sql.TinyInt,
          req.body.TRXAssetTagGenerateEnable
        )
        .input(
          "TRXAssetTagPrintingAllow",
          sql.TinyInt,
          req.body.TRXAssetTagPrintingAllow
        )
        .input(
          "TRXAllowImportExternalFile",
          sql.TinyInt,
          req.body.TRXAllowImportExternalFile
        ).query(`
        UPDATE [dbo].[TblUsers]
   SET 
      [loginpass] = @loginpass
      ,[loginfullname] = @loginfullname
      ,[branchcode] = @branchcode
      ,[adminaccess] = @adminaccess
      ,[TRXNewAssets] = @TRXNewAssets
      ,[TRXExistingAssets] = @TRXExistingAssets
      ,[TRXInventory] = @TRXInventory
      ,[TRXassetMovementInternalTransfer] = @TRXassetMovementInternalTransfer
      ,[TRXAssetMovementforRepair] = @TRXAssetMovementforRepair
      ,[TRXAssetMovementforDisposed] = @TRXAssetMovementforDisposed
      ,[TRXAssetMovementforReturns] = @TRXAssetMovementforReturns
      ,[TRXAssetTagGenerateEnable] = @TRXAssetTagGenerateEnable
      ,[TRXAssetTagPrintingAllow] = @TRXAssetTagPrintingAllow
      ,[TRXAllowImportExternalFile] = @TRXAllowImportExternalFile
        
        WHERE loginname=@loginname`);

      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async updateRegionById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("RegionCode", sql.VarChar, req.body.RegionCode)
        .input("RegionName", sql.VarChar, req.body.RegionName).query(`
        
UPDATE [dbo].[TblRegion]
SET 
   [RegionName] = @RegionName
WHERE RegionCode=@RegionCode`);

      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async updateCityById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("CityCode", sql.VarChar, req.body.CityCode)
        .input("CityName", sql.VarChar, req.body.CityName)
        .input("RegionCode", sql.VarChar, req.body.RegionCode)
        .query(`UPDATE [dbo].[TblCity]
        SET 
           [CityName] = @CityName
           ,[RegionCode] = @RegionCode
      WHERE CityCode=@CityCode`);

      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async updateCityMasterById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("CountryCode", sql.VarChar, req.body.CountryCode)
        .input("CountryName", sql.VarChar, req.body.CountryName)
        .input("RegionCode", sql.VarChar, req.body.RegionCode)
        .input("RegionName", sql.VarChar, req.body.RegionName)
        .input("CityCode", sql.VarChar, req.body.CityCode)
        .input("CityName", sql.VarChar, req.body.CityName).query(`
        UPDATE [dbo].[TblCityMaster]
           SET
              [CountryName] = @CountryName

              ,[RegionCode] = @RegionCode
                            ,[RegionName] = @RegionName

              ,[CityCode] = @CityCode
                            ,[CityName] = @CityName

         WHERE  CountryCode=@CountryCode`);
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async updateAssetRequestMasterById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("RequestNo", sql.Int, req.body.RequestNo)
        .input("TypeofRequest", sql.VarChar, req.body.TypeofRequest)
        .input("DateRequested", sql.VarChar, req.body.DateRequested)
        .input("RequestedBy", sql.VarChar, req.body.RequestedBy)
        .input(
          "UserLoginIDcurrentLogon",
          sql.VarChar,
          req.body.UserLoginIDcurrentLogon
        )
        .input(
          "ApprovingDepartmentCode",
          sql.VarChar,
          req.body.ApprovingDepartmentCode
        )
        .input(
          "AssetCurrentLocationDetails",
          sql.VarChar,
          req.body.AssetCurrentLocationDetails
        ).query(`UPDATE [dbo].[TblAssetRequestMaster]
        SET [TypeofRequest] = @TypeofRequest
           ,[DateRequested] = @DateRequested
           ,[RequestedBy] = @RequestedBy
           ,[UserLoginIDcurrentLogon] = @UserLoginIDcurrentLogon
           ,[ApprovingDepartmentCode] = @ApprovingDepartmentCode
           ,[AssetCurrentLocationDetails] = @AssetCurrentLocationDetails
      WHERE RequestNo=@RequestNo`);

      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async updateAssetRequestDetailsById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("RequestNo", sql.VarChar, req.body.RequestNo)
        .input("TypeofRequest", sql.VarChar, req.body.TypeofRequest)
        .input("DateRequested", sql.VarChar, req.body.DateRequested)
        .input("RequestedBy", sql.VarChar, req.body.RequestedBy)
        .input(
          "UserLoginIDcurrentLogon",
          sql.VarChar,
          req.body.UserLoginIDcurrentLogon
        )
        .input(
          "ApprovingDepartmentCode",
          sql.VarChar,
          req.body.ApprovingDepartmentCode
        )
        .input("TagNumberPicked", sql.VarChar, req.body.TagNumberPicked)
        .input("aSSETdESCRIPTION", sql.VarChar, req.body.aSSETdESCRIPTION)
        .input("DateScannedPicked", sql.VarChar, req.body.DateScannedPicked)
        .input("SERIALNOS1", sql.VarChar, req.body.SERIALNOS1)
        .input("DaoCity", sql.VarChar, req.body.DaoCity)
        .input("DaoArea", sql.VarChar, req.body.DaoArea)
        .input("DAOBU", sql.VarChar, req.body.DAOBU)
        .input("Dao", sql.VarChar, req.body.Dao).query(`
        UPDATE [dbo].[TblAssetRequestDetails]
           SET 
              [TypeofRequest] = @TypeofRequest
              ,[DateRequested] = @DateRequested
              ,[RequestedBy] = @RequestedBy
              ,[UserLoginIDcurrentLogon] = @UserLoginIDcurrentLogon
              ,[ApprovingDepartmentCode] = @ApprovingDepartmentCode
              ,[TagNumberPicked] = @TagNumberPicked
              ,[aSSETdESCRIPTION] = @aSSETdESCRIPTION
              ,[DateScannedPicked] = @DateScannedPicked
              ,[SERIALNOS1] = @SERIALNOS1
              ,[DaoCity] = @DaoCity
              ,[DaoArea] = @DaoArea
              ,[DAOBU] = @DAOBU
              ,[Dao] = @Dao
         WHERE  RequestNo=@RequestNo`);

      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async updateAssetConditionById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("TblAssetConditionID", sql.Int, req.body.TblAssetConditionID)
        .input("TblConditionCode", sql.VarChar, req.body.TblConditionCode)
        .input(
          "TblConditionDescription",
          sql.VarChar,
          req.body.TblConditionDescription
        ).query(`UPDATE [dbo].[TblAssetCondition]
        SET [TblConditionCode] = @TblConditionCode
           ,[TblConditionDescription] = @TblConditionDescription
      WHERE TblAssetConditionID=@TblAssetConditionID`);

      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async updateMAINCATEGORYById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("TblMAINSUBSeriesNoID", sql.Int, req.body.TblMAINSUBSeriesNoID)
        .input("MainCategoryCode", sql.VarChar, req.body.MainCategoryCode)
        .input("MainDescription", sql.VarChar, req.body.MainDescription).query(`
        UPDATE [dbo].[TblMAINCATEGORY]
           SET [MainCategoryCode] = @MainCategoryCode
              ,[MainDescription] = @MainDescription
         WHERE TblMAINSUBSeriesNoID=@TblMAINSUBSeriesNoID`);
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async updateMAINSUBSeriesNoById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("TblMAINSUBSeriesNoID", sql.Int, req.body.TblMAINSUBSeriesNoID)
        .input("MainSubSeriesNo", sql.Numeric, req.body.MainSubSeriesNo)
        .input("SeriesNumber", sql.Numeric, req.body.SeriesNumber)
        .input("MainCategoryCode", sql.VarChar, req.body.MainCategoryCode)
        .input("SubCategoryCode", sql.VarChar, req.body.SubCategoryCode)
        .input("MainDescription", sql.VarChar, req.body.MainDescription)
        .input("SubDescription", sql.VarChar, req.body.SubDescription)
        .query(`UPDATE [dbo].[TblMAINSUBSeriesNo]
        SET [MainCategoryCode] = @MainCategoryCode
           ,[SubCategoryCode] = @SubCategoryCode
           ,[MainSubSeriesNo] = @MainSubSeriesNo
           ,[MainDescription] = @MainDescription
           ,[SubDescription] = @SubDescription
           ,[SeriesNumber] = @SeriesNumber
      WHERE TblMAINSUBSeriesNoID=@TblMAINSUBSeriesNoID`);

      console.log(data);
      return res.status(200).send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async updateMakeListById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("TblMakeName", sql.VarChar, req.body.TblMakeName)
        .input("TblMakeMainCode", sql.VarChar, req.body.TblMakeMainCode)
        .input("tblMajorCode", sql.VarChar, req.body.tblMajorCode)
        .query(`UPDATE [dbo].[TblMakeList]
        SET [TblMakeName] = @TblMakeName
           ,[TblMakeMainCode] = @TblMakeMainCode
           ,[tblMajorCode] = @tblMajorCode
      WHERE TblMakeListID=${req.body.TblMakeListID}`);

      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async updateMAINSUBSeriesNoAssignedById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("MainCategoryCode", sql.Numeric, req.body.MainCategoryCode)
        .input("SeriesNumber", sql.Numeric, req.body.SeriesNumber)
        .input("MainSubSeriesNo", sql.VarChar, req.body.MainSubSeriesNo)
        .input("MainDescription", sql.VarChar, req.body.MainDescription)
        .input("SubDescription", sql.VarChar, req.body.SubDescription)
        .input("SubCategoryCode", sql.VarChar, req.body.SubCategoryCode)
        .input("UserLoginID", sql.VarChar, req.body.UserLoginID)
        .input("DeptCode", sql.VarChar, req.body.DeptCode).query(`
        UPDATE [dbo].[TblMAINSUBSeriesNoAssigned]
   SET [MainCategoryCode] = @MainCategoryCode
      ,[SubCategoryCode] = @SubCategoryCode
      ,[MainSubSeriesNo] = @MainSubSeriesNo
      ,[MainDescription] = @MainDescription
      ,[SubDescription] = @SubDescription
      ,[SeriesNumber] = @SeriesNumber

      ,[DeptCode] = @DeptCode
 WHERE  UserLoginID=@UserLoginID`);

      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async updateCountryById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("CountryCode", sql.VarChar, req.body.CountryCode)
        .input("CountryName", sql.VarChar, req.body.CountryName).query(`
        UPDATE [dbo].[TblCountry]
           SET [CountryCode] = @CountryCode
              ,[CountryName] = @CountryName
         WHERE TblCountryID=@TblCountryID`);

      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async updateInvJournalMasterById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input(
          "JournalSysAutoNumber",
          sql.Numeric,
          req.body.JournalSysAutoNumber
        )
        .input("JournalRefNo", sql.VarChar, req.body.JournalRefNo)
        .input("JournalDateCreated", sql.VarChar, req.body.JournalDateCreated)
        .input("JournalTimeCreated", sql.VarChar, req.body.JournalTimeCreated)
        .input("JournalRemarks", sql.VarChar, req.body.JournalRemarks).query(`
        UPDATE [dbo].[TblInvJournalMaster]
           SET [JournalSysAutoNumber] = @JournalSysAutoNumber
              ,[JournalRefNo] = @JournalRefNo
              ,[JournalDateCreated] = @JournalDateCreated
              ,[JournalTimeCreated] = @JournalTimeCreated
              ,[JournalRemarks] = @JournalRemarks
         WHERE TblInvJournalMasterID=${req.body.TblInvJournalMasterID}`);

      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async updateLocationTagsById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("LocationTag", sql.VarChar, req.body.LoactionTag)
        .query(`UPDATE [dbo].[TblLocationTags]
        SET [LocationTag] = @LocationTag
      WHERE TblLocationTagsID=${req.body.TblLocationTagsID}`);
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async updateUsersRolesById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("RoleID", sql.Numeric, req.body.RoleID) // must be unique
        .input("RoleDescription", sql.VarChar, req.body.RoleDescription)
        .query(`UPDATE [dbo].[TblUsersRoles]
        SET [RoleID] = @RoleID
           ,[RoleDescription] = @RoleDescription
      WHERE RoleID=${req.body.RoleID}`);
      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async updateUsersRolesAssignedById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("RoleID", sql.Numeric, req.body.RoleID)
        .input("RoleDescription", sql.VarChar, req.body.RoleDescription)
        .input("UserLoginID", sql.VarChar, req.body.UserLoginID)
        .query(`UPDATE [dbo].[TblUsersRolesAssigned]
        SET [RoleID] = @RoleID
           ,[RoleDescription] = @RoleDescription
           ,[UserLoginID] = @UserLoginID
      WHERE TblUsersRolesID=${req.body.TblUsersRolesID}`);

      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async updateUsersDepartmentById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("DeptCode", sql.VarChar, req.body.DeptCode)
        .input("DepartmentName", sql.VarChar, req.body.DepartmentName)
        .query(`UPDATE [dbo].[TblUsersDepartment]
        SET [DeptCode] = @DeptCode
           ,[DepartmentName] = @DepartmentName
      WHERE TblUsersDepartmentID=${req.body.TblUsersDepartmentID}`);

      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async updateFloorsById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("FLOORNO", sql.VarChar, req.body.FLOORNO)
        .input("FloorName", sql.VarChar, req.body.FloorName)
        .query(`UPDATE [dbo].[TblFloors]
        SET [FLOORNO] = @FLOORNO
           ,[FloorName] = @FloorName
      WHERE TblFloorsID=${req.body.TblFloorsID}`);

      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
  async updateAssetsPhotoById(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool
        .request()
        .input("PhotoTagNo", sql.VarChar, req.body.PhotoTagNo)
        .input("AssetPhoto", sql.VarBinary, req.body.AssetPhoto).query(`
        UPDATE [dbo].[TblAssetsPhoto]
           SET [PhotoTagNo] = @PhotoTagNo
              ,[AssetPhoto] = @AssetPhoto
         WHERE TblAssestsPhotoID=${req.body.TblAssetsPhotoID}`);

      console.log(data);
      return res.send(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  },
};
export default FATSDB;
