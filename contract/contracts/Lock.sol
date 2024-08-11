// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Tracking_Shipment{
    enum ShipmentStatus{PENDING, IN_TRANSIT, DELIVERED}
    struct Shipment{
        address sender;
        address receiver;
        uint256 pickupTime;
        uint256 deliveryTime;
        uint256 distance;
        uint256 price;
        ShipmentStatus status;
        bool paid;
    }
    mapping(address => Shipment[]) public shipments;
    uint256 public shipmentCounts;

    struct TypeShipment{
        address sender;
        address receiver;
        uint256 deliveryTime;
        uint256 pickupTime;
        uint256 distance;
        uint256 price;
        ShipmentStatus status;
        bool paid;
    }
    TypeShipment[] public typeShipments;

    event ShipmentCreated(address indexed sender, address indexed receiver, uint256 pickupTime, uint256 distance, uint256 price);
    event ShipmentInTransit(address indexed sender, address indexed receiver, uint256 pickupTime);
    event ShipmentInDelivered(address indexed sender, address indexed receiver, uint256 deliveredTime);
    event ShipmentPaid(address indexed sender, address indexed receiver, uint256 price);

    constructor(){
        shipmentCounts=0;
    }

    function createdShipment(address _receiver, uint256 _pickupTime, uint256 _distance, uint256 _price) public payable{
       require(msg.value == _price, "Payment amount must be match the price");
       Shipment memory shipment = Shipment(msg.sender, _receiver, _pickupTime, 0,
       _distance, _price, ShipmentStatus.PENDING, false);
      
      shipments[msg.sender].push(shipment);
      shipmentCounts++;

      TypeShipment(
        msg.sender,
        _receiver,
        _pickupTime,
        0,
        _distance,
        _price,
        ShipmentStatus.PENDING,
        false
      );
      emit ShipmentCreated(msg.sender, _receiver, _pickupTime, _distance, _price);
    } 

    function StartShipment(address _sender, address _receiver, uint256 _index) public {
       Shipment storage Shipment = shipments[_sender][_index];
       TypeShipment storage typeShipment= typeShipments[_index];
       require(Shipment.receiver == _receiver, "Invalid address");
       require(Shipment.status == ShipmentStatus.PENDING, "Shipment already in transit");

       Shipment.status= ShipmentStatus.IN_TRANSIT;
       typeShipment.status = ShipmentStatus.IN_TRANSIT;
       emit  ShipmentInTransit(_sender, _receiver, Shipment.pickupTime);
    }
}
