module.exports = {
  create: (Shipment, cb) ->
    db.Shipment.create(Shipment).then (carateShipement) ->
      return cb(null, carateShipement);
  }
