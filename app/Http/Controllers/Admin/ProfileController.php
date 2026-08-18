<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;

class ProfileController extends Controller
{
  /**
   * Show the user's profile settings page.
   */
  public function edit(Request $request): Response
  {
    return Inertia::render('Admin/Profile/Edit', [
      'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
      'status' => $request->session()->get('status'),
      'twoFactorEnabled' => Features::enabled(Features::twoFactorAuthentication()),
    ]);
  }
}
