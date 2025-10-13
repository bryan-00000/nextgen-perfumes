<?php

namespace App\Http\Controllers;

use App\Models\Newsletter;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    public function index()
    {
        return response()->json(Newsletter::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:newsletters,email',
        ]);

        $newsletter = Newsletter::create($request->all());

        return response()->json($newsletter, 201);
    }

    public function show(Newsletter $newsletter)
    {
        return response()->json($newsletter);
    }

    public function update(Request $request, Newsletter $newsletter)
    {
        $request->validate([
            'is_active' => 'boolean',
        ]);

        $newsletter->update($request->only(['is_active']));

        return response()->json($newsletter);
    }

    public function destroy(Newsletter $newsletter)
    {
        $newsletter->delete();

        return response()->json(['message' => 'Newsletter subscription deleted successfully']);
    }
}