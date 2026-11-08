package com.scheduler.service;

import com.scheduler.model.Booking;
import com.scheduler.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public Booking createBooking(Booking newBooking) {

        List<Booking> bookings = bookingRepository.findAll();

        for (Booking booking : bookings) {

            boolean sameResource =
                    booking.getResourceId().equals(newBooking.getResourceId());

            boolean sameDate =
                    booking.getBookingDate().equals(newBooking.getBookingDate());

            boolean timeOverlap =
                    newBooking.getStartTime().isBefore(booking.getEndTime())
                    && newBooking.getEndTime().isAfter(booking.getStartTime());

            if (sameResource && sameDate && timeOverlap) {
                throw new RuntimeException(
                        "Resource is already booked for this time."
                );
            }
        }

        newBooking.setStatus("CONFIRMED");

        return bookingRepository.save(newBooking);
    }

    public Booking cancelBooking(Long id) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found."));

        booking.setStatus("CANCELLED");

        return bookingRepository.save(booking);
    }
}