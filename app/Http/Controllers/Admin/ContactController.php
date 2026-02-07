<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function index()
    {
        $contacts = Contact::all();
        return Inertia::render('Admin/Utility/Contacts/Index', [
            'contacts' => $contacts
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string',
            'detail' => 'required|string',
        ]);

        Contact::create($validated);

        return redirect()->back()->with('success', 'Contact created successfully.');
    }

    public function update(Request $request, Contact $contact)
    {
        $validated = $request->validate([
            'type' => 'required|string',
            'detail' => 'required|string',
        ]);

        $contact->update($validated);

        return redirect()->back()->with('success', 'Contact updated successfully.');
    }

    public function destroy(Contact $contact)
    {
        $contact->delete();
        return redirect()->back()->with('success', 'Contact deleted successfully.');
    }
}
