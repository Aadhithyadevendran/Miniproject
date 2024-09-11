// RoomContext.js
import React, { createContext, useState, useContext } from "react";

const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
  const [rooms, setRooms] = useState([
    {
      id: 1,
      name: "Room 1",
      category: "CIA",
      availableSlots: ["8-10", "10-12", "1-3", "3-5"],
      closedSlots: [],
      closedRooms: [],
      bookings: [],
    },
    {
      id: 2,
      name: "Room 2",
      category: "CIA",
      availableSlots: ["8-10", "10-12", "1-3", "3-5"],
      closedSlots: [],
      closedRooms: [],
      bookings: [],
    },
    {
      id: 3,
      name: "Room 3",
      category: "Modules",
      availableSlots: ["8-10", "10-12", "1-3", "3-5"],
      closedSlots: [],
      closedRooms: [],
      bookings: [],
    },
  ]);

  const [bookingDateRange, setBookingDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  const updateRoom = (updatedRoom) => {
    setRooms(
      rooms.map((room) => (room.id === updatedRoom.id ? updatedRoom : room))
    );
  };

  const addBooking = (roomId, booking) => {
    const updatedRooms = rooms.map((room) => {
      if (room.id === roomId) {
        return { ...room, bookings: [...room.bookings, booking] };
      }
      return room;
    });
    setRooms(updatedRooms);
  };

  const cancelBooking = (roomId, bookingId) => {
    const updatedRooms = rooms.map((room) => {
      if (room.id === roomId) {
        const updatedBookings = room.bookings.filter(
          (booking) => booking.id !== bookingId
        );
        return { ...room, bookings: updatedBookings };
      }
      return room;
    });
    setRooms(updatedRooms);
  };

  const setBookingRange = (startDate, endDate) => {
    setBookingDateRange({ startDate, endDate });
  };

  const isDateInBookingRange = (date) => {
    if (!bookingDateRange.startDate || !bookingDateRange.endDate) return true;
    const checkDate = new Date(date);
    return (
      checkDate >= new Date(bookingDateRange.startDate) &&
      checkDate <= new Date(bookingDateRange.endDate)
    );
  };

  const bookSlot = ({
    roomId,
    name,
    regNo,
    dept,
    slot,
    date,
    macId,
    courseCode,
    courseName,
  }) => {
    const booking = {
      id: Date.now(),
      roomId,
      name,
      regNo,
      dept,
      slot,
      date,
      macId,
      courseCode,
      courseName,
    };
    addBooking(roomId, booking);
  };

  return (
    <RoomContext.Provider
      value={{
        rooms,
        updateRoom,
        addBooking,
        bookingDateRange,
        setBookingRange,
        isDateInBookingRange,
        bookSlot,
        cancelBooking,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRoomContext = () => useContext(RoomContext);
