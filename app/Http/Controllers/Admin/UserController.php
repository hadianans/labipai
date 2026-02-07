<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $users = User::query()
            ->when($request->search, function ($query, $search) {
                $query->where('username', 'like', '%' . $search . '%')
                    ->orWhere('email', 'like', '%' . $search . '%');
            })
            ->when($request->role, function ($query, $role) {
                $query->where('role', $role);
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'role', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Users/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'username' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|in:0,1,2',
            'status' => 'required|in:0,1',
            'phone' => 'nullable|string|max:20',
        ]);

        $user = User::create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'status' => $request->status,
            'phone' => $request->phone,
        ]);

        event(new Registered($user));

        return redirect()->route('admin.users.index')->with('success', 'User created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user): Response
    {
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
        ]);
    }

    /**
     * Update the status of the specified resource.
     */
    public function updateStatus(Request $request, User $user): RedirectResponse
    {
        $request->validate([
            'status' => 'required|in:0,1',
        ]);

        $user->status = $request->status;
        $user->save();

        return redirect()->back()->with('success', 'User status updated successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $request->validate([
            'username' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:user,email,' . $user->id,
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|in:0,1,2',
            'status' => 'required|in:0,1',
            'phone' => 'nullable|string|max:20',
            // Photo upload logic can be added here if needed, but usually profile photo is managed by user.
        ]);

        $user->username = $request->username;
        $user->email = $request->email;
        $user->role = $request->role;
        $user->status = $request->status;
        $user->phone = $request->phone;

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return redirect()->route('admin.users.index')->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user): RedirectResponse
    {
        if ($user->id === auth()->id()) {
            return redirect()->back()->withErrors(['message' => 'You cannot delete yourself.']);
        }

        $user->delete();

        return redirect()->route('admin.users.index')->with('success', 'User deleted successfully.');
    }
}
