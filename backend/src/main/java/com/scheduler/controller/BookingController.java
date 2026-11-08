package com.scheduler.controller;

import com.scheduler.model.Booking;
import com.scheduler.repository.BookingRepository;
import com.scheduler.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin
public class BookingController {

    private final BookingRepository bookingRepository;
    private final BookingService bookingService;

    public BookingController(
            BookingRepository bookingRepository,
            BookingService bookingService) {
        this.bookingRepository = bookingRepository;
        this.bookingService = bookingService;
    }

    @GetMapping
    public List<Booking> getBookings() {
        return bookingRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {

        try {
            Booking savedBooking = bookingService.createBooking(booking);

            return ResponseEntity.ok(savedBooking);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
    @PutMapping("/{id}/cancel")
public ResponseEntity<?> cancelBooking(@PathVariable Long id) {

    try {
        Booking booking = bookingService.cancelBooking(id);

        return ResponseEntity.ok(booking);

    } catch (RuntimeException e) {

        return ResponseEntity
                .badRequest()
                .body(e.getMessage());
    }
}
}