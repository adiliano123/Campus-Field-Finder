<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MessageController extends Controller
{
    /**
     * Get all conversations for the authenticated user.
     * Returns one entry per unique conversation partner with the latest message.
     */
    public function inbox(Request $request)
    {
        $userId = $request->user()->id;

        // Get the latest message per conversation partner
        $conversations = Message::where('sender_id', $userId)
            ->orWhere('receiver_id', $userId)
            ->with('sender:id,name,email,role', 'receiver:id,name,email,role')
            ->orderByDesc('created_at')
            ->get()
            ->groupBy(function ($msg) use ($userId) {
                // Group by the other person's ID
                return $msg->sender_id === $userId ? $msg->receiver_id : $msg->sender_id;
            })
            ->map(function ($msgs) use ($userId) {
                $latest = $msgs->first();
                $partner = $latest->sender_id === $userId ? $latest->receiver : $latest->sender;
                $unread = $msgs->where('receiver_id', $userId)->where('read', false)->count();

                return [
                    'partner'    => $partner,
                    'last_message' => $latest->body,
                    'last_time'  => $latest->created_at,
                    'unread'     => $unread,
                ];
            })
            ->values();

        return response()->json($conversations);
    }

    /**
     * Get full conversation between authenticated user and another user.
     */
    public function conversation(Request $request, $partnerId)
    {
        $userId = $request->user()->id;

        // Mark incoming messages as read
        Message::where('sender_id', $partnerId)
            ->where('receiver_id', $userId)
            ->where('read', false)
            ->update(['read' => true]);

        $messages = Message::where(function ($q) use ($userId, $partnerId) {
            $q->where('sender_id', $userId)->where('receiver_id', $partnerId);
        })->orWhere(function ($q) use ($userId, $partnerId) {
            $q->where('sender_id', $partnerId)->where('receiver_id', $userId);
        })
        ->with('sender:id,name,role')
        ->orderBy('created_at')
        ->get();

        $partner = User::select('id', 'name', 'email', 'role')->findOrFail($partnerId);

        return response()->json([
            'partner'  => $partner,
            'messages' => $messages,
        ]);
    }

    /**
     * Send a message to another user.
     */
    public function send(Request $request)
    {
        $data = $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'body'        => 'required|string|max:2000',
        ]);

        $senderId = $request->user()->id;

        abort_if($senderId === (int) $data['receiver_id'], 422, 'Cannot send a message to yourself.');

        $message = Message::create([
            'sender_id'   => $senderId,
            'receiver_id' => $data['receiver_id'],
            'body'        => $data['body'],
            'read'        => false,
        ]);

        $message->load('sender:id,name,role');

        return response()->json($message, 201);
    }

    /**
     * Get list of users the current user can message.
     * Students see companies, companies see students, admins see everyone.
     */
    public function contacts(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'admin') {
            $contacts = User::where('id', '!=', $user->id)
                ->select('id', 'name', 'email', 'role')
                ->orderBy('name')
                ->get();
        } elseif ($user->role === 'student') {
            $contacts = User::where('role', 'company')
                ->orWhere('role', 'admin')
                ->where('id', '!=', $user->id)
                ->select('id', 'name', 'email', 'role')
                ->orderBy('name')
                ->get();
        } else {
            // company
            $contacts = User::where('role', 'student')
                ->orWhere('role', 'admin')
                ->where('id', '!=', $user->id)
                ->select('id', 'name', 'email', 'role')
                ->orderBy('name')
                ->get();
        }

        return response()->json($contacts);
    }

    /**
     * Unread message count.
     */
    public function unreadCount(Request $request)
    {
        $count = Message::where('receiver_id', $request->user()->id)
            ->where('read', false)
            ->count();

        return response()->json(['count' => $count]);
    }
}
