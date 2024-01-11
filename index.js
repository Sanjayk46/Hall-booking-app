const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(express.json());
const PORT = 8000
// app.use(express.json())
let rooms=[{
    roomId:"R1",
    seatAvailable:"10",
    amenities:"tv,ac,Heater",
    pricePerhr:"200"
}];
let bookings=[{
    customer:"Sanjay K",
    bookingDate:"23/12/2023",
    startTime:"12.00pm",
    endTime:"11.59am",
    bookingId: "B1",
    roomId:"R1",
    status:"booked",
    booked_On:"20/12/2023"
}]
let customers=[{
    name:"sanjay K",
    bookings:[{
        customer:"Sanjay K",
        bookingDate:"23/12/2023",
        startTime:"12.00pm",
        endTime:"11.59am",
        bookingId: "B1",
        roomId:"R1",
        status:"booked",
        booked_On:"20/12/2023"
    }]
}];
//view room details
app.get('/rooms/all',(req,res)=>{
    try {
        res.status(200).json({RoomsList: rooms});
        console.log(rooms);
    } catch (error) {
        res.status(500).send({
            message:"Internal Server Error",
            error:error.message
        })
        
    }
})
//creating room
app.post('/rooms/create',(req,res)=>{
    try {
        const room = req.body;
        console.log(room)
        const idExists = rooms.find((el)=> el.roomId === room.roomId)
        if(idExists !== undefined){
            return res.status(400).send({
                message:"Room already booked"
            })
        }
        else{
            rooms.push(room);
            res.status(200).send({
                message:"Room created successfully",
                room
            })
            //res.send(room)
        }
        
    } catch (error) {
        res.status(500).send({
            message:"Internal Server Error",
            error:error.message
        })
    }
})
//for booking room
app.post('/rooms/booking/create/:id',(req,res)=>{
    try {
        const {id} = req.params;
        let bookRoom = req.body;
        let date = new Date();
        let dateFormat = date.toLocaleDateString();
        let idExists = rooms.find((el)=> el.roomId === id)
        if(idExists === undefined){
            return res.status(400).send({
                message: "room does not exist.",
                RoomsList:rooms
            })
        }
     let matchId = bookings.filter((b)=>b.roomId === id)
     if(matchId.length > 0){
        let dateCheck = matchId.filter((m)=>{
            return m.bookingDate === bookRoom.bookingDate
        });
        if(dateCheck.length===0){
            let newID = "B"+(bookings.length + 1);
            let newBooking = {...bookRoom,bookingId:newID, roomId:id,status:"booked", booked_On:dateFormat}
            bookings.push(newBooking)
            return res.status(201).send({
                message:"Hall booked",
                bookings:bookings,
                added:newBooking
            }); 
        }
        else{
            return res.status(200).send({
                message:"hall is already booked for this date, choose another hall",
                bookings:bookings
            });
        }
     }
     else{
        let newID = "B"+(bookings.length + 1);
        let newBooking = {...bookRoom, bookingId:newID, roomId:id, status:"booked", booked_On:dateFormat}
        bookings.push(newBooking);
        const customerdetails = customers.find(cust=>
            cust.name === newBooking.customer);
            if(customerdetails){
                customerdetails.bookings.push(newBooking);
            }
            else{
                customers.push({name:newBooking.customer, bookings:[newBooking]});
            }
            return res.status(200).send({
                message:"hall booked",
                bookings:bookings,
                added:newBooking
            })
     }   
        
    } catch (error) {
        res.status(500).send({
            message:"Internal Server Error",
            error:error.message
        })
    }
})

app.get('/rooms/viewbooking',(req,res)=>{
    try {
        const bookedRooms = bookings.map(booking => {
            const {roomId ,Status,customer,bookingDate,startTime,endTime} = booking;
            return {roomId ,Status,customer,bookingDate,startTime,endTime} 
        });
        res.status(200).json(bookedRooms);

    } catch (error) {
        res.status(500).send({
            message:"Internal Server Error",
            error:error.message
        })
    }
})
app.get('/rooms/customer',(req,res)=>{
    try {
        const customerBookings = customers.map(customer => {
            const { name, bookings } = customer;
            const customerDetails = bookings.map(booking => {
              const { roomId, bookingDate, startTime, endTime } = booking;
              return { name, roomId, bookingDate, startTime, endTime };
            });
           
            return customerDetails;
          })
         
          res.json(customerBookings);
        
    } catch (error) {
        res.status(500).send({
            message:"Internal Server Error",
            error:error.message
        })
    }
})
app.get('/rooms/customer/:name',(req,res)=>{
    try {
        const {name} = req.params;
    const customer = customers.find(cust => cust.name === name);
    if(!customer){
        res.status(404).send({
            error:"customer not found"
        })
    }
    const customerBookings = customer.bookings.map(bookings =>{
        const {customer,roomId,startTime,endTime,bookingId,status,bookingDate,booked_On} = bookings;
        return {customer,roomId,startTime,endTime,bookingId,status,bookingDate,booked_On}
    })
    res.json(customerBookings);
    } catch (error) {
        res.status(500).send({
            message:"Internal Server Error",
            error:error.message
        })
    }
})

app.listen(PORT,()=>console.log('app is running'))