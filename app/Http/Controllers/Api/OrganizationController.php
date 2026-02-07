<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Administrator;
use App\Models\Department;
use App\Models\Mission;
use App\Models\Program;
use App\Models\Vision;
use Illuminate\Http\Request;

class OrganizationController extends Controller
{
    /**
     * Get current vision and missions
     * GET /api/organization/vision
     */
    public function vision(Request $request)
    {
        $year = $request->year ?? date('Y');

        $vision = Vision::with('missions')
            ->where('year', $year)
            ->first();

        return response()->json([
            'success' => true,
            'data' => $vision,
        ]);
    }

    /**
     * Get organization structure (administrators)
     * GET /api/organization/structure
     */
    public function structure(Request $request)
    {
        $year = $request->year ?? date('Y');

        $administrators = Administrator::where('year', $year)
            ->orderByRaw("FIELD(position, 'Pelindung', 'Penanjungjawab', 'Ketua', 'Koordinator', 'Staff')")
            ->get()
            ->groupBy('division');

        return response()->json([
            'success' => true,
            'data' => [
                'year' => $year,
                'structure' => $administrators,
            ],
        ]);
    }

    /**
     * Get departments list
     * GET /api/organization/departments
     */
    public function departments(Request $request)
    {
        $year = $request->year ?? date('Y');

        $departments = Department::with([
            'members' => function ($q) use ($year) {
                $q->where('year', $year)->with('administrator');
            }
        ])->get();

        return response()->json([
            'success' => true,
            'data' => $departments,
        ]);
    }

    /**
     * Get programs list
     * GET /api/organization/programs
     */
    public function programs(Request $request)
    {
        $programs = Program::with([
            'members' => function ($q) use ($request) {
                if ($request->year) {
                    $q->where('year', $request->year)->with('administrator');
                }
            }
        ])->get();

        return response()->json([
            'success' => true,
            'data' => $programs,
        ]);
    }

    // ==================== ADMIN ENDPOINTS ====================

    /**
     * Create/Update vision (Admin)
     * POST /api/organization/vision
     */
    public function storeVision(Request $request)
    {
        $validated = $request->validate([
            'vision_point' => 'required|string|max:500',
            'year' => 'required|integer|min:2000|max:' . (date('Y') + 10),
            'missions' => 'nullable|array',
            'missions.*' => 'string|max:500',
        ]);

        $vision = Vision::updateOrCreate(
            ['year' => $validated['year']],
            ['vision_point' => $validated['vision_point']]
        );

        // Sync missions
        if ($request->has('missions')) {
            $vision->missions()->delete();
            foreach ($request->missions as $missionPoint) {
                $vision->missions()->create(['mission_point' => $missionPoint]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Visi & Misi berhasil disimpan',
            'data' => $vision->load('missions'),
        ]);
    }

    /**
     * CRUD Administrator (Admin)
     */
    public function storeAdministrator(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:100',
            'division' => 'nullable|string|max:100',
            'is_chief' => 'boolean',
            'year' => 'required|integer',
            'img_url' => 'nullable|string|max:255',
        ]);

        $admin = Administrator::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Pengurus berhasil ditambahkan',
            'data' => $admin,
        ], 201);
    }

    public function updateAdministrator(Request $request, Administrator $administrator)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'position' => 'sometimes|string|max:100',
            'division' => 'nullable|string|max:100',
            'is_chief' => 'boolean',
            'year' => 'sometimes|integer',
            'img_url' => 'nullable|string|max:255',
        ]);

        $administrator->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Pengurus berhasil diupdate',
            'data' => $administrator,
        ]);
    }

    public function destroyAdministrator(Administrator $administrator)
    {
        $administrator->delete();

        return response()->json([
            'success' => true,
            'message' => 'Pengurus berhasil dihapus',
        ]);
    }

    /**
     * CRUD Department (Admin)
     */
    public function storeDepartment(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string|max:500',
        ]);

        $department = Department::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Departemen berhasil ditambahkan',
            'data' => $department,
        ], 201);
    }

    public function updateDepartment(Request $request, Department $department)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:100',
            'description' => 'nullable|string|max:500',
        ]);

        $department->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Departemen berhasil diupdate',
            'data' => $department,
        ]);
    }

    public function destroyDepartment(Department $department)
    {
        $department->delete();

        return response()->json([
            'success' => true,
            'message' => 'Departemen berhasil dihapus',
        ]);
    }

    /**
     * CRUD Program (Admin)
     */
    public function storeProgram(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'detail_url' => 'nullable|string|max:255',
            'img_url' => 'nullable|string|max:255',
        ]);

        $program = Program::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Program berhasil ditambahkan',
            'data' => $program,
        ], 201);
    }

    public function updateProgram(Request $request, Program $program)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:100',
            'description' => 'nullable|string',
            'detail_url' => 'nullable|string|max:255',
            'img_url' => 'nullable|string|max:255',
        ]);

        $program->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Program berhasil diupdate',
            'data' => $program,
        ]);
    }

    public function destroyProgram(Program $program)
    {
        $program->delete();

        return response()->json([
            'success' => true,
            'message' => 'Program berhasil dihapus',
        ]);
    }
}
