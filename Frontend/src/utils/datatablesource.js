const renderFormattedDate = (params) => {
  const date = params?.value ? new Date(params?.value) : null;
  if (!date) return null;

  return <span>{date.toISOString().slice(0, 10)}</span>; // Format the date using the browser's locale settings
};



//User Admin Panel Assets Columns 
export const allUserAssetsColumns = [
  {
    field: "SHIPMENTSTATUS",
    headerName: "SHIPMENT STATUS",
    width: 180,

  },
  {
    field: "SHIPMENTID",
    headerName: "SHIPMENT ID",
    width: 180,

  },
  {
    field: "ENTITY",
    headerName: "ENTITY",
    width: 150,

  },
  {
    field: "CONTAINERID",
    headerName: "CONTAINER ID",
    width: 150,

  },

  {
    field: "ARRIVALWAREHOUSE",
    headerName: "ARRIVAL WAREHOUSE",
    width: 150,

  },
  {
    field: "ITEMNAME",
    headerName: "ITEM NAME",
    width: 200,

  },
  {
    field: "QTY",
    headerName: "QTY",
    width: 130,

  },
  {
    field: "ITEMID",
    headerName: "ITEM ID",
    width: 130,

  },
  {
    field: "PURCHID",
    headerName: "PURCH ID",
    width: 130,

  },
  {
    field: "CLASSIFICATION",
    headerName: "CLASSIFICATION",
    width: 150,

  },


];


export const TblShipmentReceivedClColumn = [
  {
    field: "SHIPMENTID",
    headerName: "SHIPMENT ID",
    width: 180,

  },
  {
    field: "CONTAINERID",
    headerName: "CONTAINER ID",
    width: 180,

  },
  {
    field: "ARRIVALWAREHOUSE",
    headerName: "ARRIVAL WAREHOUSE",
    width: 180,

  },
  {
    field: "ITEMNAME",
    headerName: "ITEM NAME",
    width: 180,

  },
  {
    field: "ITEMID",
    headerName: "ITEM ID",
    width: 180,

  },
  {
    field: "PURCHID",
    headerName: "PURCH ID",
    width: 180,

  },
  {
    field: "CLASSIFICATION",
    headerName: "CLASSIFICATION",
    width: 180,

  },
  {
    field: "SERIALNUM",
    headerName: "SERIAL NUM",
    width: 180,

  },
  {
    field: "RCVDCONFIGID",
    headerName: "RCVD CONFIG ID",
    width: 180,

  },
  {
    field: "RCVD_DATE",
    headerName: "RCVD DATE",
    width: 180,

  },
  {
    field: "GTIN",
    headerName: "GTIN",
    width: 180,

  },
  {
    field: "RZONE",
    headerName: "RZONE",
    width: 180,

  },
  {
    field: "PALLET_DATE",
    headerName: "PALLET DATE",
    width: 180,

  },
  {
    field: "PALLETCODE",
    headerName: "PALLET CODE",
    width: 180,

  },
  {
    field: "BIN",
    headerName: "BIN",
    width: 180,

  },
  {
    field: "REMARKS",
    headerName: "REMARKS",
    width: 180,

  },
  {
    field: "POQTY",
    headerName: "PO QTY",
    width: 180,

  },
  {
    field: "RCVQTY",
    headerName: "RCV QTY",
    width: 180,

  },
  {
    field: "REMAININGQTY",
    headerName: "REMAINING QTY",
    width: 180,

  },
  {
    field: "USERID",
    headerName: "USER ID",
    width: 180,
  },
  {
    field: "TRXDATETIME",
    headerName: "TRX DATE TIME",
    width: 180,
  },


];


export const TblReceiptsManagementColumn = [
  {
    field: "PURCHID",
    headerName: "PURCH ID",
    width: 180,
  },
  {
    field: "CREATEDDATETIME",
    headerName: "CREATED DATE TIME",
    width: 180,
  },
  {
    field: "SHIPMENTID",
    headerName: "SHIPMENT ID",
    width: 180,
  },
  {
    field: "SHIPMENTSTATUS",
    headerName: "SHIPMENT STATUS",
    width: 180,
  },
  {
    field: "CONTAINERID",
    headerName: "CONTAINER ID",
    width: 180,
  },
  {
    field: "ITEMID",
    headerName: "ITEM ID",
    width: 180,
  },
  {
    field: "QTY",
    headerName: "QTY",
    width: 180,
  },
];



export const AllItems = [
  {
    field: "ITEMID",
    headerName: "ITEM ID",
    width: 180,

  },
  {
    field: "ITEMNAME",
    headerName: "ITEM NAME",
    width: 300,

  },
  {
    field: "ITEMGROUPID",
    headerName: "ITEM GROUP ID",
    width: 180,

  },
  {
    field: "GROUPNAME",
    headerName: "GROUP NAME",
    width: 180,

  },
  {
    field: "PRODLINEID",
    headerName: "PRODLINEID",
    width: 180,

  },
  {
    field: "PRODBRANDID",
    headerName: "PRODBRANDID",
    width: 180,

  },
]

export const AllRoleColumns = [
  {
    field: "RoleId",
    headerName: "ROLE ID",
    width: 100,

  },
  {
    field: "RoleName",
    headerName: "ROLE NAME",
    width: 200,

  },

]

export const AllRolesAssignedColumns = [
  {
    field: "RoleId",
    headerName: "ROLE ID",
    width: 100,

  },

  {

    field: "RoleName",
    headerName: "ROLE NAME",
    width: 200,

  },

  {
    field: "UserID",
    headerName: "USER ID",
    width: 100,

  },
]


export const UserTableColumns = [
  {
    field: "UserID",
    headerName: "USER ID",
    width: 180,

  },
  {
    field: "UserPassword",
    headerName: "USER PASSWORD",
    width: 180,

  },
  {
    field: "Fullname",
    headerName: "FULL NAME",
    width: 180,

  },
  {
    field: "UserLevel",
    headerName: "USER LEVEL",
    width: 180,

  },
  {
    field: "Loc",
    headerName: "LOCATION",
    width: 180,

  },

  {
    field: "Email",
    headerName: "EMAIL",
    width: 180,

  },
]


export const TblAllLocationColumn = [
  {
    field: "LOCATIONS_HFID",
    headerName: "LOCATION ID",
    width: 150,

  },
  {
    field: "MAIN",
    headerName: "MAIN LOCATION",
    width: 180,

  },
  {
    field: "WAREHOUSE",
    headerName: "LOCATION WAREHOUSE",
    width: 220,

  },
  {
    field: "ZONE",
    headerName: "LOCATION ZONE",
    width: 220,

  },
  {
    field: "BIN",
    headerName: "BIN",
    width: 180,

  },
  {
    field: "ZONE_CODE",
    headerName: "ZONE CODE",
    width: 180,

  },
  {
    field: "ZONE_NAME",
    headerName: "ZONE NAME",
    width: 180,

  },

]



export const TblDispatchingCLColumn = [
  {
    field: "PACKINGSLIPID",
    headerName: "PACKING SLIP ID",
    width: 150,

  },
  {
    field: "VEHICLESHIPPLATENUMBER",
    headerName: "VEHICLE SHIP LATE NUMBER",
    width: 180,

  },
  {
    field: "INVENTLOCATIONID",
    headerName: "INVENT LOCATION ID",
    width: 220,

  },
  {
    field: "ITEMID",
    headerName: "ITEM ID",
    width: 180,

  },
  {
    field: "ORDERED",
    headerName: "ORDERED",
    width: 180,

  },
  {
    field: "NAME",
    headerName: "NAME",
    width: 150,

  },
  {
    field: "CONFIGID",
    headerName: "CONFIG ID",
    width: 150,

  },
  {
    field: "SALESID",
    headerName: "SALES ID",
    width: 180,

  },

]



export const PackingSlipColumn = [
  {
    field: "SALESID",
    headerName: "SALES ID",
    width: 200,

  },
  {
    field: "ITEMID",
    headerName: "ITEM ID",
    width: 200,

  },
  {
    field: "NAME",
    headerName: "NAME",
    width: 200,

  },
  {
    field: "INVENTLOCATIONID",
    headerName: "INVENT LOCATION ID",
    width: 200,

  },
  {
    field: "CONFIGID",
    headerName: "CONFIG ID",
    width: 150,

  },
  {
    field: "ORDERED",
    headerName: "ORDERED",
    width: 150,

  },
  {
    field: "Actual delivered",
    headerName: "ACTUAL DELIVERED",
    width: 150,

  },
  {
    field: "PACKINGSLIPID",
    headerName: "PACKING SLIP ID",
    width: 200,

  },

]


// TODO: reomve these AllItemsDispatchColumn

export const AllItemsDispatchColumn = [
  {
    field: "PACKINGSLIPID",
    headerName: "PACKING SLIP ID",
    width: 150,

  },
  {
    field: "VEHICLESHIPPLATENUMBER",
    headerName: "VEHICLE SHIP LATE NUMBER",
    width: 180,

  },
  {
    field: "INVENTLOCATIONID",
    headerName: "INVENT LOCATION ID",
    width: 220,

  },
  {
    field: "INVENTSITEID",
    headerName: "INVENT SITE ID",
    width: 180,

  },
  {
    field: "WMSLOCATIONID",
    headerName: "WMS LOCATION ID",
    width: 180,

  },
  {
    field: "ITEMID",
    headerName: "ITEM ID",
    width: 180,

  },
  {
    field: "QTY",
    headerName: "QTY",
    width: 150,

  },
  {
    field: "REMAIN",
    headerName: "REMAIN",
    width: 150,

  },
  {
    field: "NAME",
    headerName: "NAME",
    width: 180,

  },
  {
    field: "CONFIGID",
    headerName: "CONFIG ID",
    width: 180,
  },
  {
    field: "PICKINGROUTEID",
    headerName: "PICKING ROUTE ID",
    width: 180,
  },

]

export const PackingSlipTableColumn = [
  {
    field: "PACKINGSLIPID",
    headerName: "PACKING SLIP ID",
    width: 150,
  },
  {
    field: "VEHICLESHIPPLATENUMBER",
    headerName: "VEHICLE SHIP PLATE NUMBER",
    width: 180,
  },
  {
    field: "INVENTLOCATIONID",
    headerName: "INVENT LOCATION ID",
    width: 220,
  },
  {
    field: "ITEMID",
    headerName: "ITEM ID",
    width: 180,
  },
  {
    field: "ORDERED",
    headerName: "ORDERED",
    width: 150,
  },
  {
    field: "NAME",
    headerName: "NAME",
    width: 180,
  },
  {
    field: "CONFIGID",
    headerName: "CONFIG ID",
    width: 180,
  },
  {
    field: "SALESID",
    headerName: "SALES ID",
    width: 180,
  },
];




export const InternalTransferColumn = [
  {
    field: "ALS_PACKINGSLIPREF",
    headerName: "ALS PACKING SLIP REFERENCE",
    width: 200,

  },
  {
    field: "ALS_TRANSFERORDERTYPE",
    headerName: "ALS TRANSFER ORDER TYPE",
    width: 180,

  },
  {
    field: "TRANSFERID",
    headerName: "TRANSFER ID",
    width: 180,

  },
  {
    field: "INVENTLOCATIONIDFROM",
    headerName: "INVENT LOCATION ID FROM",
    width: 180,

  },
  {
    field: "INVENTLOCATIONIDTO",
    headerName: "INVENT LOCATION ID TO",
    width: 180,

  },
  {
    field: "QTYTRANSFER",
    headerName: "QTY TRANSFER",
    width: 180,

  },
  {
    field: "ITEMID",
    headerName: "ITEM ID",
    width: 180,

  },
  {
    field: "ITEMNAME",
    headerName: "ITEM NAME",
    width: 180,

  },
  {
    field: "CONFIGID",
    headerName: "CONFIG ID",
    width: 180,

  },
  {
    field: "WMSLOCATIONID",
    headerName: "WMS LOCATION ID",
    width: 180,
  },
  {
    field: "SHIPMENTID",
    headerName: "SHIPMENT ID",
    width: 180,
  },

]



export const ExpectedReceiptsColumn = [
  {
    field: "PURCHID",
    headerName: "PURCH ID",
    width: 180,

  },
  {
    field: "CREATEDDATETIME",
    headerName: "CREATED DATE TIME",
    width: 180,

  },
  {
    field: "SHIPMENTID",
    headerName: "SHIPMENT ID",
    width: 180,

  },
  {
    field: "SHIPMENTSTATUS",
    headerName: "SHIPMENT STATUS",
    width: 180,

  },
  {
    field: "CONTAINERID",
    headerName: "CONTAINER ID",
    width: 180,

  },
  {
    field: "ITEMID",
    headerName: "ITEM ID",
    width: 180,

  },
  {
    field: "QTY",
    headerName: "QTY",
    width: 180,

  },


]



export const ExpectedTranferOrderColumn = [
  {
    field: "TRANSFERID",
    headerName: "TRANSFER ID",
    width: 200,

  },
  {
    field: "TRANSFERSTATUS",
    headerName: "TRANSFER STATUS",
    width: 180,

  },
  {
    field: "INVENTLOCATIONIDFROM",
    headerName: "INVENT LOCATION ID FROM",
    width: 180,

  },
  {
    field: "INVENTLOCATIONIDTO",
    headerName: "INVENT LOCATION ID TO",
    width: 180,

  },
  {
    field: "ITEMID",
    headerName: "ITEM ID",
    width: 180,

  },
  {
    field: "QTYTRANSFER",
    headerName: "QTY TRANSFER",
    width: 180,

  },

  {
    field: "QTYRECEIVED",
    headerName: "QTY RECEIVED",
    width: 180,

  },
  {
    field: "CREATEDDATETIME",
    headerName: "CREATED DATE TIME",
    width: 180,

  },


]



// export const PickListColumn = [
//   {
//     field: "PICKINGROUTEID",
//     headerName: "PICKING ROUTE ID",
//     width: 180,

//   },
//   {
//     field: "INVENTLOCATIONID",
//     headerName: "INVENT LOCATION ID",
//     width: 180,

//   },
//   {
//     field: "ITEMID",
//     headerName: "ITEM ID",
//     width: 180,

//   },
//   {
//     field: "CONFIGID",
//     headerName: "CONFIG ID",
//     width: 180,

//   },
//   {
//     field: "ITEMNAME",
//     headerName: "ITEM NAME",
//     width: 180,

//   },
//   {
//     field: "QTY",
//     headerName: "QTY",
//     width: 180,

//   },
//   {
//     field: "EXPEDITIONSTATUS",
//     headerName: "EXPEDITION STATUS",
//     width: 220,

//   },


// ]

export const PickListColumn = [
  {
    field: "PICKINGROUTEID",
    headerName: "PICKING ROUTE ID",
    width: 180,
  },
  {
    field: "INVENTLOCATIONID",
    headerName: "INVENT LOCATION ID",
    width: 180,
  },
  {
    field: "CONFIGID",
    headerName: "CONFIG ID",
    width: 180,
  },
  {
    field: "ITEMID",
    headerName: "ITEM ID",
    width: 180,
  },
  {
    field: "ITEMNAME",
    headerName: "ITEM NAME",
    width: 180,
  },
  {
    field: "QTY",
    headerName: "QTY",
    width: 180,
  },
  {
    field: "CUSTOMER",
    headerName: "CUSTOMER",
    width: 180,
  },
  {
    field: "DLVDATE",
    headerName: "DELIVERY DATE",
    width: 180,
  },
  {
    field: "TRANSREFID",
    headerName: "TRANSACTION REF ID",
    width: 180,
  },
  {
    field: "EXPEDITIONSTATUS",
    headerName: "EXPEDITION STATUS",
    width: 220,
  },
];




export const TblPickingClColumn = [
  {
    field: "PICKINGROUTEID",
    headerName: "PICKING ROUTE ID",
    width: 180,
  },
  {
    field: "INVENTLOCATIONID",
    headerName: "INVENT LOCATION ID",
    width: 180,
  },
  {
    field: "CONFIGID",
    headerName: "CONFIG ID",
    width: 180,
  },
  {
    field: "ITEMID",
    headerName: "ITEM ID",
    width: 180,
  },
  {
    field: "ITEMNAME",
    headerName: "ITEM NAME",
    width: 180,
  },
  {
    field: "QTY",
    headerName: "QTY",
    width: 180,
  },
  {
    field: "CUSTOMER",
    headerName: "CUSTOMER",
    width: 180,
  },
  {
    field: "DLVDATE",
    headerName: "DELIVERY DATE",
    width: 180,
  },
  {
    field: "TRANSREFID",
    headerName: "TRANSREF ID",
    width: 180,
  },
  {
    field: "EXPEDITIONSTATUS",
    headerName: "EXPEDITION STATUS",
    width: 180,
  },
  {
    field: "DATETIMEASSIGNED",
    headerName: "DATETIME ASSIGNED",
    width: 180,
  },
  {
    field: "ASSIGNEDTOUSERID",
    headerName: "ASSIGNED TO USER ID",
    width: 180,
  },
  {
    field: "PICKSTATUS",
    headerName: "PICK STATUS",
    width: 180,
  },
  {
    field: "QTYPICKED",
    headerName: "QTY PICKED",
    width: 180,
  },
  {
    field: "WMSLOCATIONID",
    headerName: "WMS LOCATION ID",
    width: 180,
  },
]



export const MappedItemsColumn = [
  {
    field: "ItemCode",
    headerName: "ITEM CODE",
    width: 180,

  },
  {
    field: "ItemDesc",
    headerName: "ITEM DESCRIPTION",
    width: 180,

  },
  {
    field: "GTIN",
    headerName: "GTIN",
    width: 180,

  },
  {
    field: "Remarks",
    headerName: "REMARKS",
    width: 180,

  },
  {
    field: "User",
    headerName: "USER",
    width: 180,

  },
  {
    field: "Classification",
    headerName: "CLASSIFICATION",
    width: 180,

  },
  {
    field: "MainLocation",
    headerName: "MAIN LOCATION",
    width: 180,

  },
  {
    field: "BinLocation",
    headerName: "BIN LOCATION",
    width: 180,

  },
  {
    field: "IntCode",
    headerName: "INT CODE",
    width: 180,

  },
  {
    field: "ItemSerialNo",
    headerName: "ITEM SERIAL NO",
    width: 180,

  },
  {
    field: "MapDate",
    headerName: "MAP DATE",
    width: 220,

    renderCell: renderFormattedDate,

  },
  {
    field: "PalletCode",
    headerName: "PALLET CODE",
    width: 180,

  },
  {
    field: "Reference",
    headerName: "REFERENCE",
    width: 220,

  },
  {
    field: "SID",
    headerName: "SID",
    width: 180,

  },
  {
    field: "CID",
    headerName: "CID",
    width: 180,

  },
  {
    field: "PO",
    headerName: "PO",
    width: 180,

  },
  {
    field: "Trans",
    headerName: "TRANS",
    width: 180,

  },
  {
    field: "Length",
    headerName: "LENGTH",
    width: 180,
    type: 'number',

  },
  {
    field: "Width",
    headerName: "WIDTH",
    width: 180,
    type: 'number',

  },
  {
    field: "Height",
    headerName: "HEIGHT",
    width: 180,
    type: 'number',
  },
  {
    field: "Weight",
    headerName: "WEIGHT",
    width: 180,
    type: 'number',
  },
  {
    field: "QrCode",
    headerName: "QR CODE",
    width: 180,

  },
  {
    field: "TrxDate",
    headerName: "TRX DATE",
    width: 180,

    renderCell: renderFormattedDate,
  },



]



export const shipmentPalletizingColumn = [
  {
    field: "ALS_PACKINGSLIPREF",
    headerName: "ALS PACKINGSLIP REF",
    width: 180,

  },
  {
    field: "ALS_TRANSFERORDERTYPE",
    headerName: "ALS TRANSFER ORDER TYPE",
    width: 180,

  },
  {
    field: "TRANSFERID",
    headerName: "TRANSFER ID",
    width: 180,

  },
  {
    field: "INVENTLOCATIONIDFROM",
    headerName: "INVENT LOCATION ID FROM",
    width: 180,

  },
  {
    field: "INVENTLOCATIONIDTO",
    headerName: "INVENT LOCATION ID TO",
    width: 180,

  },
  {
    field: "QTYTRANSFER",
    headerName: "QTY TRANSFER",
    width: 180,

  },
  {
    field: "ITEMID",
    headerName: "ITEM ID",
    width: 180,

  },
  {
    field: "ITEMNAME",
    headerName: "ITEM NAME",
    width: 180,

  },
  {
    field: "CONFIGID",
    headerName: "CONFIG ID",
    width: 180,

  },
  {
    field: "WMSLOCATIONID",
    headerName: "WMS LOCATION ID",
    width: 180,

  },
  {
    field: "SHIPMENTID",
    headerName: "SHIPMENT ID",
    width: 180,

  },



]



export const PalletizingByTransferIdColumn = [
  {
    field: "ALS_PACKINGSLIPREF",
    headerName: "ALS PACKING SLIP REF",
    width: 180,
  },
  {
    field: "ALS_TRANSFERORDERTYPE",
    headerName: "ALS TRANSFER ORDER TYPE",
    width: 180,
  },
  {
    field: "TRANSFERID",
    headerName: "TRANSFER ID",
    width: 180,
  },
  {
    field: "INVENTLOCATIONIDFROM",
    headerName: "INVENT LOCATION ID FROM",
    width: 180,
  },
  {
    field: "INVENTLOCATIONIDTO",
    headerName: "INVENT LOCATION ID TO",
    width: 180,
  },
  {
    field: "QTYTRANSFER",
    headerName: "QTY TRANSFER",
    width: 180,
  },
  {
    field: "ITEMID",
    headerName: "ITEM ID",
    width: 180,
  },
  {
    field: "ITEMNAME",
    headerName: "ITEM NAME",
    width: 180,
  },
  {
    field: "CONFIGID",
    headerName: "CONFIG ID",
    width: 180,
  },
  {
    field: "WMSLOCATIONID",
    headerName: "WMS LOCATION ID",
    width: 180,
  },
  {
    field: "SHIPMENTID",
    headerName: "SHIPMENT ID",
    width: 180,
  },
]




export const SideBarTableColumn = [
  {
    field: "ItemCode",
    headerName: "ITEM CODE",
    width: 180,

  },
  {
    field: "ItemDesc",
    headerName: "ITEM DESCRIPTION",
    width: 180,

  },
  {
    field: "GTIN",
    headerName: "GTIN",
    width: 180,

  },
  {
    field: "Remarks",
    headerName: "REMARKS",
    width: 180,

  },
  {
    field: "User",
    headerName: "USER",
    width: 180,

  },
  {
    field: "Classification",
    headerName: "CLASSIFICATION",
    width: 180,

  },
  {
    field: "MainLocation",
    headerName: "MAIN LOCATION",
    width: 180,

  },
  {
    field: "BinLocation",
    headerName: "BIN LOCATION",
    width: 180,

  },
  {
    field: "IntCode",
    headerName: "INT CODE",
    width: 180,

  },
  {
    field: "ItemSerialNo",
    headerName: "ITEM SERIAL NO",
    width: 180,

  },
  {
    field: "MapDate",
    headerName: "MAP DATE",
    width: 180,

  },
  {
    field: "PalletCode",
    headerName: "PALLET CODE",
    width: 180,

  },
  {
    field: "Reference",
    headerName: "REFERENCE",
    width: 180,

  },
  {
    field: "SID",
    headerName: "SID",
    width: 180,

  },
  {
    field: "CID",
    headerName: "MAP DATE",
    width: 180,

  },
  {
    field: "PO",
    headerName: "MAP DATE",
    width: 180,

  },
  {
    field: "Trans",
    headerName: "TRANS",
    width: 180,

  },



]



export const BinToBinCLColumn = [
  {
    field: "ITEMID",
    headerName: "ITEM ID",
    width: 180,

  },
  {
    field: "TRANSFERID",
    headerName: "TRANSFER ID",
    width: 180,

  },
  {
    field: "TRANSFERSTATUS",
    headerName: "TRANSFER STATUS",
    width: 180,

  },
  {
    field: "INVENTLOCATIONIDFROM",
    headerName: "INVENT LOCATION ID FROM",
    width: 180,

  },
  {
    field: "INVENTLOCATIONIDTO",
    headerName: "INVENT LOCATION ID TO",
    width: 180,

  },
  {
    field: "QTYTRANSFER",
    headerName: "QTY TRANSFER",
    width: 180,

  },
  {
    field: "QTYRECEIVED",
    headerName: "QTY RECEIVED",
    width: 180,

  },
  {
    field: "CREATEDDATETIME",
    headerName: "CREATED DATE TIME",
    width: 180,

  },
  {
    field: "ItemCode",
    headerName: "Item Code",
    width: 180,

  },
  {
    field: "ItemDesc",
    headerName: "Item Desc",
    width: 180,

  },
  {
    field: "GTIN",
    headerName: "GTIN",
    width: 180,

  },
  {
    field: "Remarks",
    headerName: "Remarks",
    width: 180,

  },
  {
    field: "User",
    headerName: "User",
    width: 180,

  },
  {
    field: "Classification",
    headerName: "CLASSIFICATION",
    width: 180,

  },
  {
    field: "MainLocation",
    headerName: "MAIN LOCATION",
    width: 180,

  },
  {
    field: "BinLocation",
    headerName: "BIN LOCATION",
    width: 180,

  },
  {
    field: "IntCode",
    headerName: "INT CODE",
    width: 180,

  },
  {
    field: "ItemSerialNo",
    headerName: "ITEM SERIAL NO",
    width: 180,

  },
  {
    field: "MapDate",
    headerName: "MAP DATE",
    width: 180,

  },
  {
    field: "PalletCode",
    headerName: "PALLET CODE",
    width: 180,

  },
  {
    field: "Reference",
    headerName: "REFERENCE",
    width: 180,

  },
  {
    field: "SID",
    headerName: "SID",
    width: 180,

  },
  {
    field: "CID",
    headerName: "CID",
    width: 180,

  },
  {
    field: "PO",
    headerName: "PO",
    width: 180,

  },
  {
    field: "Trans",
    headerName: "TRANS",
    width: 180,

  },
  {
    field: "SELECTTYPE",
    headerName: "SELECT TYPE",
    width: 180,

  },



]





export const journalListColumn = [
  {
    field: "JOURNALID",
    headerName: "JOURNAL ID",
    width: 180,

  },
  {
    field: "ITEMID",
    headerName: "ITEM ID",
    width: 180,

  },
  {
    field: "QTY",
    headerName: "QTY",
    width: 180,

  },
  {
    field: "CONFIGID",
    headerName: "CONFIG ID",
    width: 180,

  },
  {
    field: "INVENTLOCATIONID",
    headerName: "INVENT LOCATION ID",
    width: 180,

  },
  {
    field: "WMSLOCATIONID",
    headerName: "WMS LOCATION ID",
    width: 180,

  },
  {
    field: "INVENTSITEID",
    headerName: "INVENT SITE ID",
    width: 180,

  },
  {
    field: "TOCONFIGID",
    headerName: "TO CONFIG ID",
    width: 180,

  },
  {
    field: "TOINVENTLOCATIONID",
    headerName: "TO INVENT LOCATION ID",
    width: 180,

  },
  {
    field: "TOWMSLOCATIONID",
    headerName: "TO WMS LOCATION ID",
    width: 180,

  },
  {
    field: "TOINVENTSITEID",
    headerName: "TO INVENT SITE ID",
    width: 180,

  },



]




export const PicklistAssignedColumn = [
  {
    field: "PICKINGROUTEID",
    headerName: "PICKING ROUTE ID",
    width: 180,

  },
  {
    field: "INVENTLOCATIONID",
    headerName: "INVENT LOCATION ID",
    width: 180,

  },
  {
    field: "CONFIGID",
    headerName: "CONFIG ID",
    width: 180,

  },
  {
    field: "ITEMID",
    headerName: "ITEM ID",
    width: 180,

  },
  {
    field: "ITEMNAME",
    headerName: "ITEM NAME",
    width: 180,

  },
  {
    field: "QTY",
    headerName: "QTY",
    width: 180,

  },
  {
    field: "CUSTOMER",
    headerName: "CUSTOMER",
    width: 180,

  },
  {
    field: "WMSLOCATIONID",
    headerName: "WMSLOCATIONID",
    width: 180,

  },
  {
    field: "TRANSREFID",
    headerName: "TRANSREFID",
    width: 180,

  },
  {
    field: "EXPEDITIONSTATUS",
    headerName: "EXPEDITION STATUS",
    width: 180,

  },



]



export const SalesPickingListColumn = [
  {
    field: "PICKINGROUTEID",
    headerName: "PICKING ROUTE ID",
    width: 180,

  },
  {
    field: "INVENTLOCATIONID",
    headerName: "INVENT LOCATION ID",
    width: 180,

  },
  {
    field: "CONFIGID",
    headerName: "CONFIG ID",
    width: 180,

  },
  {
    field: "ITEMID",
    headerName: "ITEM ID",
    width: 180,

  },
  {
    field: "ITEMNAME",
    headerName: "ITEM NAME",
    width: 180,

  },
  {
    field: "QTY",
    headerName: "QTY",
    width: 180,

  },
  {
    field: "CUSTOMER",
    headerName: "CUSTOMER",
    width: 180,

  },
  {
    field: "DLVDATE",
    headerName: "DLVDATE",
    width: 180,

  },
  {
    field: "TRANSREFID",
    headerName: "TRANSREFID",
    width: 180,

  },
  {
    field: "EXPEDITIONSTATUS",
    headerName: "EXPEDITION STATUS",
    width: 180,

  },
  {
    field: "ASSIGNEDTOUSERID",
    headerName: "ASSIGNEDTOUSER ID",
    width: 180,

  },
  {
    field: "PICKSTATUS",
    headerName: "PICK STATUS",
    width: 180,

  },
  {
    field: "QTYPICKED",
    headerName: "QTY PICKED",
    width: 180,

  },




]




export const ReturnSalesOrderColumn = [
  {
    field: "ITEMID",
    headerName: "ITEM ID",
    width: 180,

  },
  {
    field: "NAME",
    headerName: "NAME",
    width: 230,

  },
  {
    field: "EXPECTEDRETQTY",
    headerName: "EXPECTEDRETQTY",
    width: 180,

  },
  {
    field: "SALESID",
    headerName: "SALES ID",
    width: 180,

  },
  {
    field: "RETURNITEMNUM",
    headerName: "RETURN ITEM NUM",
    width: 180,

  },
  {
    field: "INVENTSITEID",
    headerName: "INVENT SITE ID",
    width: 180,

  },
  {
    field: "INVENTLOCATIONID",
    headerName: "INVENT LOCATION ID",
    width: 180,

  },
  {
    field: "CONFIGID",
    headerName: "CONFIG ID",
    width: 180,

  },
  {
    field: "WMSLOCATIONID",
    headerName: "WMS LOCATION ID",
    width: 180,

  },
  {
    field: "TRXDATETIME",
    headerName: "TRANSACTION DATETIME",
    width: 220,
  },
  {
    field: "TRXUSERID",
    headerName: "TRANSACTION USER ID",
    width: 180,
  },
  {
    field: "ITEMSERIALNO",
    headerName: "ITEM SERIAL NO",
    width: 200,
  },
  {
    field: "ASSIGNEDTOUSERID",
    headerName: "ASSIGNED TO USER ID",
    width: 180,
  },



]



export const JournalProfitLostColumn = [
  {
    field: "ITEMID",
    headerName: "ITEM ID",
    width: 180,

  },
  {
    field: "ITEMNAME",
    headerName: "ITEMNAME",
    width: 230,

  },
  {
    field: "QTY",
    headerName: "QTY",
    width: 180,

  },
  {
    field: "JOURNALID",
    headerName: "JOURNAL ID",
    width: 180,

  },
  {
    field: "TRANSDATE",
    headerName: "TRANS DATE",
    width: 180,

  },
  {
    field: "INVENTSITEID",
    headerName: "INVENT SITE ID",
    width: 180,

  },
  {
    field: "INVENTLOCATIONID",
    headerName: "INVENT LOCATION ID",
    width: 180,

  },
  {
    field: "CONFIGID",
    headerName: "CONFIG ID",
    width: 180,

  },
  {
    field: "WMSLOCATIONID",
    headerName: "WMS LOCATION ID",
    width: 180,

  },



]




export const JournalMovementColumn = [
  {
    field: "ITEMID",
    headerName: "ITEM ID",
    width: 180,

  },
  {
    field: "ITEMNAME",
    headerName: "ITEMNAME",
    width: 230,

  },
  {
    field: "QTY",
    headerName: "QTY",
    width: 180,

  },
  {
    field: "LEDGERACCOUNTIDOFFSET",
    headerName: "LEDGER ACCOUNT ID OFF SET",
    width: 180,

  },
  {
    field: "JOURNALID",
    headerName: "JOURNAL ID",
    width: 180,

  },
  {
    field: "TRANSDATE",
    headerName: "TRANS DATE",
    width: 180,

  },
  {
    field: "INVENTSITEID",
    headerName: "INVENT SITE ID",
    width: 180,

  },
  {
    field: "INVENTLOCATIONID",
    headerName: "INVENT LOCATION ID",
    width: 180,

  },
  {
    field: "CONFIGID",
    headerName: "CONFIG ID",
    width: 180,

  },
  {
    field: "WMSLOCATIONID",
    headerName: "WMS LOCATION ID",
    width: 180,

  },



]



export const JournalCountingTableColumn = [
  {
    field: "ITEMID",
    headerName: "ITEM ID",
    width: 180,

  },
  {
    field: "ITEMNAME",
    headerName: "ITEMNAME",
    width: 230,

  },
  {
    field: "QTY",
    headerName: "QTY",
    width: 180,

  },
  {
    field: "INVENTONHAND",
    headerName: "INVENT ON HAND",
    width: 180,

  },
  {
    field: "COUNTED",
    headerName: "COUNTED",
    width: 180,

  },
  {
    field: "JOURNALID",
    headerName: "JOURNAL ID",
    width: 180,

  },
  {
    field: "TRANSDATE",
    headerName: "TRANS DATE",
    width: 180,

  },
  {
    field: "INVENTSITEID",
    headerName: "INVENT SITE ID",
    width: 180,

  },
  {
    field: "INVENTLOCATIONID",
    headerName: "INVENT LOCATION ID",
    width: 180,

  },
  {
    field: "CONFIGID",
    headerName: "CONFIG ID",
    width: 180,

  },
  {
    field: "WMSLOCATIONID",
    headerName: "WMS LOCATION ID",
    width: 180,

  },



]




export const WarehouseMovementColumn = [
  {
    field: "ITEMID",
    headerName: "ITEM ID",
    width: 180,

  },
  {
    field: "ITEMNAME",
    headerName: "ITEMNAME",
    width: 230,

  },
  {
    field: "QTY",
    headerName: "QTY",
    width: 180,

  },
  {
    field: "LEDGERACCOUNTIDOFFSET",
    headerName: "LEDGER ACCOUNT ID OFF SET",
    width: 180,

  },
  {
    field: "JOURNALID",
    headerName: "JOURNAL ID",
    width: 180,

  },
  {
    field: "TRANSDATE",
    headerName: "TRANS DATE",
    width: 180,

  },
  {
    field: "INVENTSITEID",
    headerName: "INVENT SITE ID",
    width: 180,

  },
  {
    field: "INVENTLOCATIONID",
    headerName: "INVENT LOCATION ID",
    width: 180,

  },
  {
    field: "CONFIGID",
    headerName: "CONFIG ID",
    width: 180,

  },
  {
    field: "WMSLOCATIONID",
    headerName: "WMS LOCATION ID",
    width: 180,

  },
  {
    field: "TRXDATETIME",
    headerName: "TRX DATETIME",
    width: 180,

  },
  {
    field: "TRXUSERIDASSIGNED",
    headerName: "TRX USER ID ASSIGNED",
    width: 180,

  },
  {
    field: "TRXUSERIDASSIGNEDBY",
    headerName: "TRX USER ID ASSIGNED BY",
    width: 180,

  },
  {
    field: "ITEMSERIALNO",
    headerName: "ITEM SERIAL NO",
    width: 180,

  },
  {
    field: "QTYSCANNED",
    headerName: "QTY SCANNED",
    width: 180,

  },
  {
    field: "QTYDIFFERENCE",
    headerName: "QTY DIFFERENCE",
    width: 180,

  },




]



export const WarehouseProfitLostColumn = [
  {
    field: "ITEMID",
    headerName: "ITEM ID",
    width: 180,

  },
  {
    field: "ITEMNAME",
    headerName: "ITEMNAME",
    width: 230,

  },
  {
    field: "QTY",
    headerName: "QTY",
    width: 180,

  },
  {
    field: "JOURNALID",
    headerName: "JOURNAL ID",
    width: 180,

  },
  {
    field: "TRANSDATE",
    headerName: "TRANS DATE",
    width: 180,

  },
  {
    field: "INVENTSITEID",
    headerName: "INVENT SITE ID",
    width: 180,

  },
  {
    field: "INVENTLOCATIONID",
    headerName: "INVENT LOCATION ID",
    width: 180,

  },
  {
    field: "CONFIGID",
    headerName: "CONFIG ID",
    width: 180,

  },
  {
    field: "WMSLOCATIONID",
    headerName: "WMS LOCATION ID",
    width: 180,

  },
  {
    field: "TRXDATETIME",
    headerName: "TRX DATE TIME",
    width: 180,

  },
  {
    field: "TRXUSERIDASSIGNED",
    headerName: "TRX USER ID ASSIGNED",
    width: 180,

  },
  {
    field: "TRXUSERIDASSIGNEDBY",
    headerName: "TRX USERID ASSIGNED BY",
    width: 180,

  },
  {
    field: "ITEMSERIALNO",
    headerName: "ITEM SERIAL NO",
    width: 180,

  },
  {
    field: "QTYSCANNED",
    headerName: "QTY SCANNED",
    width: 180,

  },
  {
    field: "QTYDIFFERENCE",
    headerName: "QTY DIFFERENCE",
    width: 180,

  },





]



export const WarehouseJournalCountingColumn = [
  {
    field: "ITEMID",
    headerName: "ITEM ID",
    width: 180,

  },
  {
    field: "ITEMNAME",
    headerName: "ITEMNAME",
    width: 230,

  },
  {
    field: "QTY",
    headerName: "QTY",
    width: 180,

  },
  {
    field: "INVENTONHAND",
    headerName: "INVENT ON HAND",
    width: 180,

  },
  {
    field: "COUNTED",
    headerName: "COUNTED",
    width: 180,

  },
  {
    field: "JOURNALID",
    headerName: "JOURNAL ID",
    width: 180,

  },
  {
    field: "TRANSDATE",
    headerName: "TRANS DATE",
    width: 180,

  },
  {
    field: "INVENTSITEID",
    headerName: "INVENT SITE ID",
    width: 180,

  },
  {
    field: "INVENTLOCATIONID",
    headerName: "INVENT LOCATION ID",
    width: 180,

  },
  {
    field: "CONFIGID",
    headerName: "CONFIG ID",
    width: 180,

  },
  {
    field: "WMSLOCATIONID",
    headerName: "WMS LOCATION ID",
    width: 180,

  },
  {
    field: "TRXDATETIME",
    headerName: "TRX DATE TIME",
    width: 180,

  },
  {
    field: "TRXUSERIDASSIGNED",
    headerName: "TRX USER ID ASSIGNED",
    width: 180,

  },
  {
    field: "TRXUSERIDASSIGNEDBY",
    headerName: "TRX USERID ASSIGNED BY",
    width: 180,

  },
  {
    field: "ITEMSERIALNO",
    headerName: "ITEM SERIAL NO",
    width: 180,

  },
  {
    field: "QTYSCANNED",
    headerName: "QTY SCANNED",
    width: 180,

  },
  {
    field: "QTYDIFFERENCE",
    headerName: "QTY DIFFERENCE",
    width: 180,

  },





]



export const WarehouseWmsInventoryColumn = [
  {
    field: "ITEMID",
    headerName: "ITEM ID",
    width: 180,

  },
  {
    field: "ITEMNAME",
    headerName: "ITEMNAME",
    width: 230,

  },
  {
    field: "ITEMGROUPID",
    headerName: "ITEM GROUP ID",
    width: 180,

  },
  {
    field: "GROUPNAME",
    headerName: "GROUP NAME",
    width: 180,

  },
  {
    field: "INVENTORYBY",
    headerName: "INVENTORY BY",
    width: 180,

  },
  {
    field: "TRXDATETIME",
    headerName: "TRX DATE TIME",
    width: 180,

  },
  {
    field: "TRXUSERIDASSIGNED",
    headerName: "TRX USER ID ASSIGNED",
    width: 180,

  },
  {
    field: "TRXUSERIDASSIGNEDBY",
    headerName: "TRX USERID ASSIGNED BY",
    width: 180,

  },
  {
    field: "QTYSCANNED",
    headerName: "QTY SCANNED",
    width: 180,

  },
  {
    field: "QTYDIFFERENCE",
    headerName: "QTY DIFFERENCE",
    width: 180,

  },
  {
    field: "QTYONHAND",
    headerName: "QTY ON HAND",
    width: 180,

  },
  {
    field: "JOURNALID",
    headerName: "JOURNAL ID",
    width: 180,

  },




]



export const WmsByBinlocationColumn = [
  {
    field: "BinLocation",
    headerName: "BY BINLOCATION",
    width:600,

  },




]



export const WmsItemMappedColumn = [
  {
    field: "ItemCode",
    headerName: "ItemCode",
    width: 180,

  },
  {
    field: "ItemDesc",
    headerName: "ItemDesc",
    width: 180,

  },
  {
    field: "GTIN",
    headerName: "GTIN",
    width: 180,

  },
  {
    field: "Remarks",
    headerName: "Remarks",
    width: 180,

  },
  {
    field: "User",
    headerName: "User",
    width: 180,

  },
  {
    field: "Classification",
    headerName: "Classification",
    width: 180,

  },
  {
    field: "MainLocation",
    headerName: "MainLocation",
    width: 180,

  },
  {
    field: "BinLocation",
    headerName: "BinLocation",
    width: 180,

  },
  {
    field: "IntCode",
    headerName: "IntCode",
    width: 180,

  },
  {
    field: "ItemSerialNo",
    headerName: "ItemSerialNo",
    width: 180,

  },
  {
    field: "MapDate",
    headerName: "MapDate",
    width: 180,

  },
  {
    field: "PalletCode",
    headerName: "PalletCode",
    width: 180,

  },
  {
    field: "Reference",
    headerName: "Reference",
    width: 180,

  },
  {
    field: "SID",
    headerName: "SID",
    width: 180,

  },
  {
    field: "CID",
    headerName: "CID",
    width: 180,

  },
  {
    field: "PO",
    headerName: "PO",
    width: 180,

  },
  {
    field: "Trans",
    headerName: "Trans",
    width: 180,

  },




]




export const TruckMasterDataColumn = [
  {
    field: "PlateNo",
    headerName: "PLATE NO",
    width: 180,

  },
  {
    field: "BarcodeSerialNumber",
    headerName: "BARCODE SERIAL NUMBER",
    width: 180,

  },
  {
    field: "TransportationCompanyName",
    headerName: "TRANSPORTATION COMPANY NAME",
    width: 180,

  },




]



export const ZoneMasterColumn = [
  {
    field: "GroupWarehouse",
    headerName: "GROUP WAREHOUSE",
    width: 180,

  },
  {
    field: "Zones",
    headerName: "ZONES",
    width: 180,

  },
  {
    field: "BinNumber",
    headerName: "BIN NUMBER",
    width: 180,

  },
  {
    field: "ZoneType",
    headerName: "ZONE TYPE",
    width: 180,

  },




]



export const BinMasterColumn = [
  {
    field: "GroupWarehouse",
    headerName: "GROUP WAREHOUSE",
    width: 180,

  },
  {
    field: "Zones",
    headerName: "Zones",
    width: 180,

  },
  {
    field: "BinNumber",
    headerName: "BinNumber",
    width: 180,

  },
  {
    field: "ZoneType",
    headerName: "ZONE TYPE",
    width: 180,

  },
  {
    field: "BinHeight",
    headerName: "BIN HEIGHT",
    width: 180,

  },
  {
    field: "BinRow",
    headerName: "BIN ROW",
    width: 180,

  },
  {
    field: "BinWidth",
    headerName: "BIN WIDTH",
    width: 180,

  },
  {
    field: "BinTotalSize",
    headerName: "BIN TOTAL SIZE",
    width: 180,

  },
  {
    field: "BinType",
    headerName: "BIN TYPE",
    width: 180,

  },




]



export const TransactionHistoryColumn = [
  {
    field: "TrxNo",
    headerName: "TRX NO",
    width: 180,

  },
  {
    field: "TrxDateTime",
    headerName: "TRX DATE TIME",
    width: 180,

  },
  {
    field: "TrxUserID",
    headerName: "TRX USER ID",
    width: 180,

  },
  {
    field: "TransactionName",
    headerName: "TRANSACTION NAME",
    width: 180,

  },
  {
    field: "ItemID",
    headerName: "ITEM ID",
    width: 180,

  },




]





export const PalletMasterColumn = [
  {
    field: "GroupWarehouse",
    headerName: "GROUP WAREHOUSE",
    width: 180,

  },
  {
    field: "Zones",
    headerName: "ZONES",
    width: 180,

  },
  {
    field: "PalletNumber",
    headerName: "PALLETNUMBER",
    width: 180,

  },
  {
    field: "PalletHeight",
    headerName: "PALLET HEIGHT",
    width: 180,

  },
  {
    field: "PalletRow",
    headerName: "PALLET ROW",
    width: 180,

  },
  {
    field: "PalletWidth",
    headerName: "PALLETWIDTH",
    width: 180,

  },
  {
    field: "PalletTotalSize",
    headerName: "PALLET TOTAL SIZE",
    width: 180,

  },
  {
    field: "PalletType",
    headerName: "PALLET TYPE",
    width: 180,

  },
  {
    field: "PalletLength",
    headerName: "PALLET LENGTH",
    width: 180,

  },




]




export const ZoneReceivingColoumn = [
  {
    field: "tbl_RZONESID",
    headerName: "TBL RZONES ID",
    width: 180,
  },
  {
    field: "RZONE",
    headerName: "RZONE",
    width: 180,
  },
  // {
  //   field: "id",
  //   headerName: "ID",
  //   width: 180,
  // },




]




export const ZoneDispacthingColumn = [
  {
    field: "tbl_DZONESID",
    headerName: "TBL DZONES ID",
    width: 180,
  },
  {
    field: "DZONE",
    headerName: "DZONE",
    width: 180,
  },



]
