module.exports = {
  create: async (Shipment) => {  
    return await db.Shipment.create(Shipment);
  }
}
