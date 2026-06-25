<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    /**
     * GET /documents
     * Returns all documents belonging to authenticated user.
     */
    public function index(Request $request)
    {
        $documents = Document::where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->get();

        return response()->json($documents);
    }

    /**
     * POST /documents
     * Upload a document (CV, transcript, etc.).
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'file' => 'required|file|mimes:pdf,doc,docx|max:5120', // 5MB max
            'type' => 'required|in:cv,transcript,recommendation,other',
        ]);

        $file = $request->file('file');
        $originalName = $file->getClientOriginalName();
        $path = $file->store('documents', 'public');
        $url = url(Storage::url($path));

        $document = Document::create([
            'user_id' => $request->user()->id,
            'type'    => $data['type'],
            'name'    => $originalName,
            'path'    => $path,
            'url'     => $url,
            'size'    => $file->getSize(),
        ]);

        return response()->json($document, 201);
    }

    /**
     * DELETE /documents/{id}
     * Delete a document.
     */
    public function destroy(Request $request, $id)
    {
        $document = Document::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        // Delete from storage
        Storage::disk('public')->delete($document->path);

        $document->delete();

        return response()->json(['message' => 'Document deleted.']);
    }
}
