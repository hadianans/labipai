<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Administrator;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdministratorController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $tab = $request->input('tab', 'active'); // 'active' or 'inactive'

        $query = Administrator::query()
            ->when($search, function ($q, $search) {
                $q->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('position', 'like', "%{$search}%");
                });
            });

        if ($tab === 'active') {
            $query->where('is_active', true);
        } else {
            $query->where('is_active', false);
        }

        $administrators = $query->orderBy('is_chief', 'desc') // Chiefs first
            ->orderBy('year', 'desc')
            ->get();

        return Inertia::render('Admin/Organization/Administrators/Index', [
            'administrators' => $administrators,
            'filters' => [
                'search' => $search,
                'tab' => $tab
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:administrator',
            'name' => 'required|string',
            'position' => 'required|string',
            'year' => 'required|integer',
            'phone' => 'nullable|string',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'is_chief' => 'boolean',
            'image' => 'nullable|image|max:2048', // for img_url
        ]);

        if ($request->hasFile('image')) {
            $validated['img_url'] = $request->file('image')->store('administrators', 'public');
        }

        Administrator::create($validated);

        return redirect()->back()->with('success', 'Administrator created successfully.');
    }

    public function update(Request $request, Administrator $administrator)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:administrator,email,' . $administrator->id,
            'name' => 'required|string',
            'position' => 'required|string',
            'year' => 'required|integer',
            'phone' => 'nullable|string',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'is_chief' => 'boolean',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($administrator->img_url) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($administrator->img_url);
            }
            $validated['img_url'] = $request->file('image')->store('administrators', 'public');
        }

        $administrator->update($validated);

        return redirect()->back()->with('success', 'Administrator updated successfully.');
    }

    public function destroy(Administrator $administrator)
    {
        if ($administrator->img_url) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($administrator->img_url);
        }
        $administrator->delete();
        return redirect()->back()->with('success', 'Administrator deleted successfully.');
    }
}
