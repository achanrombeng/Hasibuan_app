<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Notifications/Index', [
            'notifications' => auth()->user()->notifications()->paginate(10),
        ]);
    }

    public function getUnread()
    {
        return response()->json([
            'unread_count' => auth()->user()->unreadNotifications->count(),
            'notifications' => auth()->user()->notifications()->limit(5)->get(),
        ]);
    }

    public function markAsRead($id)
    {
        $notification = auth()->user()->notifications()->where('id', $id)->first();

        if ($notification) {
            $notification->markAsRead();
        }

        return back();
    }

    public function markAllRead()
    {
        auth()->user()->unreadNotifications->markAsRead();
        return back();
    }

    public function clearAll()
    {
        auth()->user()->notifications()->delete();
        return back()->with('success', __('messages.notifications_cleared'));
    }
}
