<?php

it('returns a successful response', function () {
    // Root redirects to shop homepage
    $response = $this->get('/');
    $response->assertRedirect('/shop');

    // Shop homepage returns 200
    $response = $this->get('/shop');
    $response->assertStatus(200);
});
