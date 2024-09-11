import React, { useState, useEffect } from 'react';
import { useRoomContext } from '../RoomContext';
import '../styles/student.css';

const Student = () => {
  const { rooms, bookSlot, isDateInBookingRange, cancelBooking } = useRoomContext();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [slot, setSlot] = useState('');
  const [date, setDate] = useState('');
  const [macId, setMacId] = useState('');
  const [category, setCategory] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [cancelAlert, setCancelAlert] = useState('');
  const [invalidDate, setInvalidDate] = useState(false);

  // Fixed student details
  const studentName = 'DIVYA K';
  const regNo = '212222230035';
  const dept = 'AI&DS';

  useEffect(() => {
    if (category === 'Modules') {
      const availableRoom = rooms.find(room => room.category === 'Modules');
      if (availableRoom) {
        setSelectedRoom(availableRoom);
      }
    } else {
      setSelectedRoom(null);
    }
  }, [category, rooms]);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setDate('');
    setSelectedRoom(null);
    setInvalidDate(false);
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setDate(newDate);
    if (!isDateInBookingRange(newDate)) {
      setInvalidDate(true);
      setSelectedRoom(null);
      setSlot('');
    } else {
      setInvalidDate(false);
      if (category !== 'Modules') {
        setSelectedRoom(null);
      }
    }
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
  };

  const handleBookSlot = () => {
    if (!selectedRoom || !slot || !date || !macId || !courseCode || !courseName) {
      alert('Please fill in all details');
      return;
    }

    if (invalidDate) {
      alert('The selected date is outside the allowed booking range');
      return;
    }

    // Check if the student already has a booking for the same slot
    const studentBookings = selectedRoom.bookings.filter(
      booking => booking.regNo === regNo && booking.date === date
    );

    const hasBookingForSlot = studentBookings.some(
      booking => booking.slot === slot
    );

    if (hasBookingForSlot) {
      alert('You have already booked this slot.');
      return;
    }

    // Check if the student has booked more than two slots on the same day
    if (studentBookings.length >= 2) {
      alert('You cannot book more than two slots on the same day.');
      return;
    }

    // Check if the room or slot is closed for the selected date
    if (!selectedRoom.closedRooms.includes(date) && !selectedRoom.closedSlots.some(s => s.slot === slot && s.date === date)) {
      bookSlot({
        roomId: selectedRoom.id,
        name: studentName,
        regNo,
        dept,
        slot,
        date,
        macId,
        courseCode,
        courseName
      });
      setBookingSuccess('Slot booked successfully!');
      setTimeout(() => setBookingSuccess(''), 3000);
      setSlot('');
      setDate('');
      setMacId('');
      setCourseCode('');
      setCourseName('');
    } else {
      alert('The selected room or slot is closed for the chosen date');
    }
  };

  const handleCancelBooking = (roomId, bookingId) => {
    cancelBooking(roomId, bookingId);
    setCancelAlert('Booking cancelled');
    setTimeout(() => setCancelAlert(''), 3000);
  };

  const filteredRooms = !invalidDate ? rooms
    .filter(room => room.category === category)
    .filter(room => !room.closedRooms.includes(date)) : [];

  const bookingsToShow = filteredRooms
    .flatMap(room => room.bookings)
    .filter(booking => booking.regNo === regNo);

  return (
    <div className="student-container">
      {cancelAlert && (
        <div className={`alert-cancel ${cancelAlert ? 'show fade-out' : ''}`}>
          {cancelAlert}
        </div>
      )}
      {invalidDate && (
        <div className="alert-invalid-date">
          The selected date is outside the allowed booking range.
        </div>
      )}
      <header className="student-header">
        <h1>Welcome, {studentName}</h1>
        <p>Reg No: {regNo}</p>
        <p>Dept: {dept}</p>
      </header>
      <div className="category-selector">
        <h2>Select Category</h2>
        <select onChange={handleCategoryChange} value={category}>
          <option value="">Select Category</option>
          <option value="CIA">CIA Exams</option>
          <option value="Modules">Modules and Skill Assessment</option>
        </select>
      </div>
      {category && (
        <div className="date-selector">
          <h2>Select Date</h2>
          <input
            type="date"
            onChange={handleDateChange}
            value={date}
          />
        </div>
      )}
      
      {category && date && !invalidDate && category !== 'Modules' && (
        <div className="rooms" style={{display:'inline-block',width:'50%'}}>
          {filteredRooms.length === 0 && <p>No rooms available for the selected date.</p>}
          {filteredRooms.map(room => (
            <div key={room.id} className={`room ${room.closedRooms.includes(date) ? 'closed' : ''}`} style={{display:'inline-block',width:'40%',marginLeft:'20px'}}>
              <h2>{room.name}</h2>
              <button onClick={() => handleRoomSelect(room)}>Select Room</button>
            </div>
          ))}
        </div>
      )}
      {(selectedRoom || (category === 'Modules' && filteredRooms.length === 1)) && (
        <div className="booking-form">
          <h2>Book a Slot in {selectedRoom ? selectedRoom.name : filteredRooms[0].name}</h2>
          <select onChange={(e) => setSlot(e.target.value)} value={slot}>
            <option value="">Select Slot</option>
            {(selectedRoom || filteredRooms[0]).availableSlots.map(slot => (
              <option key={slot} value={slot} disabled={(selectedRoom || filteredRooms[0]).closedSlots.some(closed => closed.slot === slot && closed.date === date)}>
                {slot}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="MAC ID"
            onChange={(e) => setMacId(e.target.value)}
            value={macId}
          />
          <input
            type="text"
            placeholder="Course Code"
            onChange={(e) => setCourseCode(e.target.value)}
            value={courseCode}
          />
          <input
            type="text"
            placeholder="Course Name"
            onChange={(e) => setCourseName(e.target.value)}
            value={courseName}
          />
          <button style={{width:'30%',textAlign:'center',display:'inline-block'}} onClick={handleBookSlot}>Book Slot</button>
        </div>
      )}
      {bookingSuccess && (
        <div className="booking-success-message">
          {bookingSuccess}
        </div>
      )}
      {bookingsToShow.length > 0 && (
        <div className="booking-history">
          <h2>Your Bookings</h2>
          <table>
            <thead>
              <tr>
                <td>Room Number</td>
                <td>Slot</td>
                <td>Date</td>
                <td>MAC ID</td>
                <td>Course Code</td>
                <td>Course Name</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody>
              {bookingsToShow.map(booking => {
                const room = rooms.find(r => r.id === booking.roomId);
                return (
                  <tr key={booking.id}>
                    <td>{room ? room.name : 'Unknown'}</td>
                    <td>{booking.slot}</td>
                    <td>{booking.date}</td>
                    <td>{booking.macId}</td>
                    <td>{booking.courseCode}</td>
                    <td>{booking.courseName}</td>
                    <td>
                      <button onClick={() => handleCancelBooking(room.id, booking.id)}>Cancel</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Student;
