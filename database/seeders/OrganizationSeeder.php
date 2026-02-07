<?php

namespace Database\Seeders;

use App\Models\Administrator;
use App\Models\Mission;
use App\Models\Program;
use App\Models\Vision;
use Illuminate\Database\Seeder;

class OrganizationSeeder extends Seeder
{
    public function run(): void
    {
        $year = 2026;

        // Create Vision & Missions
        $vision = Vision::create([
            'vision_point' => 'Menjadi laboratorium terdepan dalam pengembangan ilmu dan praktik Pendidikan Agama Islam yang inovatif, kreatif, dan berlandaskan nilai-nilai Islam.',
            'year' => $year,
        ]);

        $missions = [
            'Mengembangkan kurikulum dan metodologi pembelajaran PAI yang inovatif',
            'Meningkatkan kompetensi mahasiswa PAI melalui program-program unggulan',
            'Menjalin kerjasama dengan lembaga pendidikan dan masyarakat',
            'Menyediakan fasilitas dan sumber belajar PAI yang berkualitas',
            'Mengembangkan penelitian dan pengabdian di bidang PAI',
        ];

        foreach ($missions as $missionPoint) {
            Mission::create([
                'vision_id' => $vision->id,
                'mission_point' => $missionPoint,
            ]);
        }

        // Create Administrators
        $administrators = [
            ['name' => 'Prof. Dr. H. Ahmad Fauzi, M.Pd.', 'email' => 'ahmad.fauzi@baitulhikmah.id', 'description' => 'Pelindung - Rektorat'],
            ['name' => 'Dr. Muhammad Iqbal, M.Ag.', 'email' => 'muhammad.iqbal@baitulhikmah.id', 'description' => 'Penanggungjawab - Prodi PAI'],
            ['name' => 'Fatimah Az-Zahra', 'email' => 'fatimah.azzahra@baitulhikmah.id', 'description' => 'Ketua - Laboratorium'],
            ['name' => 'Ahmad Dzikri', 'email' => 'ahmad.dzikri@baitulhikmah.id', 'description' => 'Wakil Ketua - Laboratorium'],
            ['name' => 'Aisyah Putri', 'email' => 'aisyah.putri@baitulhikmah.id', 'description' => 'Sekretaris - Sekretariat'],
            ['name' => 'Ibrahim Malik', 'email' => 'ibrahim.malik@baitulhikmah.id', 'description' => 'Bendahara - Keuangan'],
            ['name' => 'Umar Faruq', 'email' => 'umar.faruq@baitulhikmah.id', 'description' => 'Koordinator - Rumah Tangga'],
            ['name' => 'Khadijah Nur', 'email' => 'khadijah.nur@baitulhikmah.id', 'description' => 'Koordinator - Media & IT'],
            ['name' => 'Ali Imran', 'email' => 'ali.imran@baitulhikmah.id', 'description' => 'Koordinator - Kajian Keilmuan'],
            ['name' => 'Maryam Salsabila', 'email' => 'maryam.salsabila@baitulhikmah.id', 'description' => 'Koordinator - Pengembangan SDM'],
        ];

        foreach ($administrators as $admin) {
            Administrator::create(array_merge($admin, ['year' => $year]));
        }

        // Create Programs
        $programs = [
            [
                'name' => 'PPBQ',
                'description' => 'Program Pemantapan Baca Quran (PPBQ) adalah program unggulan Laboratorium Baitulhikmah yang bertujuan untuk meningkatkan kemampuan membaca Al-Quran mahasiswa dengan baik dan benar sesuai kaidah tajwid.',
            ],
            [
                'name' => 'Hamasah',
                'description' => 'Halaqah Majelis Sabtu Ahad (Hamasah) adalah program kajian rutin mingguan yang membahas berbagai tema keislaman untuk meningkatkan wawasan dan pemahaman agama.',
            ],
            [
                'name' => 'Tahsin Al-Quran',
                'description' => 'Program perbaikan bacaan Al-Quran yang fokus pada makharijul huruf dan sifatul huruf untuk mencapai bacaan yang fasih dan tartil.',
            ],
            [
                'name' => 'Daurah Tajwid',
                'description' => 'Program pembelajaran tajwid intensif yang membahas kaidah-kaidah tajwid secara komprehensif dengan praktik langsung.',
            ],
        ];

        foreach ($programs as $program) {
            Program::create($program);
        }
    }
}
