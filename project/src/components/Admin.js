import React, { useState, useEffect } from 'react';
import { useRoomContext } from '../RoomContext';
import '../styles/admin.css';

const Admin = () => {
  const { rooms, updateRoom, bookingDateRange, setBookingRange, addCourse, courses } = useRoomContext();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [closedSlot, setClosedSlot] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  
  const [bookingRangeStart, setBookingRangeStart] = useState(bookingDateRange.startDate || '');
  const [bookingRangeEnd, setBookingRangeEnd] = useState(bookingDateRange.endDate || '');

  // States for viewing closed rooms and slots
  const [viewDate, setViewDate] = useState('');
  const [viewSlot, setViewSlot] = useState('');
  const [viewBookings, setViewBookings] = useState([]);
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCourseName, setNewCourseName] = useState('');

  // Alert states
  const [alert, setAlert] = useState({ message: '', type: '' });

  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => {
        setAlert({ message: '', type: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);
  
  const handleAddCourse = () => {
    if (newCourseCode && newCourseName) {
      addCourse({ code: newCourseCode, name: newCourseName }, 'CIA Exams'); // Specify section here
      setNewCourseCode('');
      setNewCourseName('');
      showAlert('Course added successfully to CIA Exams', 'success');
    } else {
      showAlert('Please provide both course code and name', 'error');
    }
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
  };

  const showAlert = (message, type) => {
    setAlert({ message, type });
  };

  const handleCloseSlot = () => {
    if (selectedRoom && closedSlot && selectedDate) {
      const updatedRoom = {
        ...selectedRoom,
        closedSlots: [...selectedRoom.closedSlots, { slot: closedSlot, date: selectedDate }]
      };
      updateRoom(updatedRoom);
      showAlert('Slot closed for the selected date', 'success');
      setClosedSlot('');
      setSelectedDate('');
    } else {
      showAlert('Please select a slot and date', 'error');
    }
  };

  const handleCloseRoom = () => {
    if (selectedRoom && selectedDate) {
      const updatedRoom = {
        ...selectedRoom,
        closedRooms: [...selectedRoom.closedRooms, selectedDate]
      };
      updateRoom(updatedRoom);
      showAlert('Room closed for the selected date', 'success');
      setSelectedDate('');
    } else {
      showAlert('Please select a date', 'error');
    }
  };

  const handleOpenSlot = (roomId, slot, date) => {
    const room = rooms.find(room => room.id === roomId);
    const updatedRoom = {
      ...room,
      closedSlots: room.closedSlots.filter(closed => !(closed.slot === slot && closed.date === date))
    };
    updateRoom(updatedRoom);
    showAlert('Slot opened', 'success');
  };

  const handleOpenRoom = (roomId, date) => {
    const room = rooms.find(room => room.id === roomId);
    const updatedRoom = {
      ...room,
      closedRooms: room.closedRooms.filter(closedDate => closedDate !== date)
    };
    updateRoom(updatedRoom);
    showAlert('Room opened', 'success');
  };

  const handleSlotChange = (e) => {
    setClosedSlot(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const isSlotClosed = (slot) => {
    return selectedRoom?.closedSlots.some(closed => closed.slot === slot && closed.date === selectedDate);
  };

  const isRoomClosed = () => {
    return selectedRoom?.closedRooms.includes(selectedDate);
  };

  const handleSetBookingRange = () => {
    if (bookingRangeStart && bookingRangeEnd) {
      setBookingRange(bookingRangeStart, bookingRangeEnd);
      showAlert('Booking date range set successfully', 'success');
    } else {
      showAlert('Please select both start and end dates', 'error');
    }
  };

  const handleViewBookings = () => {
    if (!viewDate || !viewSlot) {
      showAlert('Please select both date and slot to view bookings.', 'error');
      return;
    }

    let filteredBookings = [];

    rooms.forEach(room => {
      room.bookings.forEach(booking => {
        if (booking.date === viewDate && booking.slot === viewSlot) {
          filteredBookings.push({ ...booking, roomName: room.name });
        }
      });
    });

    setViewBookings(filteredBookings);
  };

  const hasClosedRooms = rooms.some(room => room.closedRooms.length > 0);
  const hasClosedSlots = rooms.some(room => room.closedSlots.length > 0);

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>

      {alert.message && (
        <div className={`alert ${alert.type} show`}>
          {alert.message}
        </div>
      )}
         
      {/* Rooms List */}
      <div className="rooms">
        {rooms.map(room => (
          <div key={room.id} className={`room ${room.closedRooms.includes(selectedDate) ? 'closed' : ''}`}>
            <h2>{room.name}</h2>
            <button onClick={() => handleRoomSelect(room)}>Manage Room</button>
          </div>
        ))}
      </div>

      {/* Booking Range Form */}
      <div style={{ display: 'flex' }}>
        <div className="booking-range-form">
          <h2>Set Booking Date Range</h2>
          <input
            type="date"
            value={bookingRangeStart}
            onChange={(e) => setBookingRangeStart(e.target.value)}
          />
          <input
            type="date"
            value={bookingRangeEnd}
            onChange={(e) => setBookingRangeEnd(e.target.value)}
          />
          <button onClick={handleSetBookingRange}>Set Booking Range</button>
        </div>
        {/* View Bookings Section */}
        <div className="view-bookings-form">
          <h2>View Bookings</h2>

          <input
            type="date"
            value={viewDate}
            onChange={(e) => setViewDate(e.target.value)}
            placeholder="Select Date"
          />
          <select value={viewSlot} onChange={(e) => setViewSlot(e.target.value)}>
            <option value="">Select Slot</option>
            {rooms.flatMap(room => room.availableSlots).filter((v, i, a) => a.indexOf(v) === i).map(slot => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </select>
          <button style={{ marginTop: '20px' }} onClick={handleViewBookings}>View Bookings</button>
        </div>
        <div className="course-management">
          <h2>Manage Courses (CIA)</h2>
          <div className="predefined-courses">
            {/* Predefined courses can be displayed here */}
          </div>
          <div className="add-course">
            <input
              type="text"
              placeholder="Course Code"
              value={newCourseCode}
              onChange={(e) => setNewCourseCode(e.target.value)}
            />
            <input
              type="text"
              placeholder="Course Name"
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
            />
            <button onClick={handleAddCourse}>Add Course</button>
          </div>
        </div>
      </div>

      {/* Management Form */}
      {selectedRoom && (
        <div className="management-form">
          <h2>Manage {selectedRoom.name}</h2>

          {/* Close Slot */}
          <div style={{ display: 'flex' }}>
            <div style={{ display: 'inline-block' }}>
              <h3>Close Slot</h3>

              <input
                type="date"
                onChange={handleDateChange}
                value={selectedDate}
              />
              <select onChange={handleSlotChange} value={closedSlot} disabled={isRoomClosed()}>
                <option value="">Select Slot to Close</option>
                {selectedRoom.availableSlots
                  .filter(slot => !isSlotClosed(slot))
                  .map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
              </select>
              <button onClick={handleCloseSlot} disabled={isRoomClosed()}>Close Slot</button>
            </div>

            {/* Close Room */}
            <div style={{ display: 'inline-block', marginLeft: '80px' }}>
              <h3>Close Room</h3>
              <input
                type="date"
                onChange={handleDateChange}
                value={selectedDate}
              />
              <button onClick={handleCloseRoom}>Close Room</button>
            </div>
          </div>
        </div>
      )}

      {/* Closed Rooms and Slots Tables */}
      {hasClosedRooms && (
        <div className="closed-tables">
          <h2>Closed Rooms</h2>
          <table style={{ margin: 0 }} className="closed-rooms-table">
            <thead>
              <tr>
                <th>Room Name</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map(room => 
                room.closedRooms.map((date, index) => (
                  <tr key={`${room.id}-closed-${index}`}>
                    <td>{room.name}</td>
                    <td>{date}</td>
                    <td>
                      <button onClick={() => handleOpenRoom(room.id, date)}>Open</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {hasClosedSlots && (
        <div className="closed-tables">
          <h2>Closed Slots</h2>
          <table style={{ margin: 0 }} className="closed-slots-table">
            <thead>
              <tr>
                <th>Room Name</th>
                <th>Slot</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map(room => 
                room.closedSlots.map((closed, index) => (
                  <tr key={`${room.id}-closed-slot-${index}`}>
                    <td>{room.name}</td>
                    <td>{closed.slot}</td>
                    <td>{closed.date}</td>
                    <td>
                      <button onClick={() => handleOpenSlot(room.id, closed.slot, closed.date)}>Open</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* View Bookings Table */}
      <div className="view-bookings-section">
        {viewBookings.length > 0 ? (
          <table style={{ margin: 0 }} className="view-bookings-table">
            <thead>
              <tr>
              <h2>Bookings</h2>

              </tr>
              <tr>
                <th>Room Name</th>
                <th>Name</th>
                <th>Reg No</th>
                <th>Dept</th>
                <th>MAC ID</th>
                <th>Course Code</th>
                <th>Course Name</th>
              </tr>
            </thead>
            <tbody>
              {viewBookings.map(booking => (
                <tr key={booking.id}>
                  <td>{booking.roomName}</td>
                  <td>{booking.name}</td>
                  <td>{booking.regNo}</td>
                  <td>{booking.dept}</td>
                  <td>{booking.macId}</td>
                  <td>{booking.courseCode}</td>
                  <td>{booking.courseName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          viewDate && viewSlot && <p>No bookings yet.</p>
        )}
      </div>
    </div>
  );
};

export default Admin;
