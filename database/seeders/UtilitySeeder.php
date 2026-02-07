<?php

namespace Database\Seeders;

use App\Models\Announcement;
use App\Models\Calendar;
use App\Models\Contact;
use App\Models\Gallery;
use App\Models\Tag;
use Illuminate\Database\Seeder;

class UtilitySeeder extends Seeder
{
    public function run(): void
    {
        // Create Tags
        $tags = ['Kegiatan', 'PPBQ', 'Kajian', 'Wisuda', 'Hamasah', 'Dokumentasi'];
        foreach ($tags as $tagName) {
            Tag::create(['name' => $tagName]);
        }

        // Create Galleries
        $galleries = [
            ['title' => 'Pembukaan PPBQ Batch 5', 'description' => 'Dokumentasi acara pembukaan PPBQ Batch 5', 'img_url' => '/storage/gallery/ppbq-opening.jpg', 'is_hero' => true, 'tags' => [1, 2]],
            ['title' => 'Kajian Rutin Hamasah', 'description' => 'Suasana kajian Hamasah bersama Ustadz Ahmad', 'img_url' => '/storage/gallery/hamasah.jpg', 'is_hero' => true, 'tags' => [3, 5]],
            ['title' => 'Wisuda Tahfidz 2025', 'description' => 'Wisuda para penghafal Al-Quran', 'img_url' => '/storage/gallery/wisuda.jpg', 'is_hero' => true, 'tags' => [4, 6]],
            ['title' => 'Praktikum Mengajar', 'description' => 'Mahasiswa melakukan praktikum mengajar', 'img_url' => '/storage/gallery/praktikum.jpg', 'is_hero' => false, 'tags' => [1, 6]],
            ['title' => 'Perpustakaan Lab', 'description' => 'Koleksi buku di perpustakaan laboratorium', 'img_url' => '/storage/gallery/perpustakaan.jpg', 'is_hero' => false, 'tags' => [6]],
        ];

        foreach ($galleries as $galleryData) {
            $tagIds = $galleryData['tags'];
            unset($galleryData['tags']);

            $gallery = Gallery::create($galleryData);
            $gallery->tags()->attach($tagIds);
        }

        // Create Announcements
        $announcements = [
            [
                'title' => 'Pendaftaran PPBQ Batch 6',
                'content' => 'Pendaftaran PPBQ Batch 6 telah dibuka! Segera daftarkan diri Anda untuk mengikuti program pemantapan baca Al-Quran.',
                'priority' => Announcement::PRIORITY_IMPORTANT,
                'type' => Announcement::TYPE_POPUP,
                'status' => Announcement::STATUS_PUBLISH,
                'action_url' => 'https://forms.google.com/ppbq-batch6',
                'start_date' => now(),
                'end_date' => now()->addDays(30),
            ],
            [
                'title' => 'Jadwal Kajian Hamasah Januari 2026',
                'content' => 'Berikut jadwal kajian Hamasah bulan Januari 2026. Tema: Adab-adab Menuntut Ilmu.',
                'priority' => Announcement::PRIORITY_STANDARD,
                'type' => Announcement::TYPE_SECTION,
                'status' => Announcement::STATUS_PUBLISH,
                'start_date' => now(),
                'end_date' => now()->addDays(30),
            ],
            [
                'title' => 'Libur Akhir Semester',
                'content' => 'Laboratorium Baitulhikmah akan libur pada tanggal 20-31 Januari 2026.',
                'priority' => Announcement::PRIORITY_LOW,
                'type' => Announcement::TYPE_SECTION,
                'status' => Announcement::STATUS_PUBLISH,
            ],
        ];

        foreach ($announcements as $announcement) {
            Announcement::create($announcement);
        }

        // Create Calendar Events
        $events = [
            [
                'title' => 'Kajian Hamasah',
                'description' => 'Kajian rutin Sabtu Ahad',
                'start_time' => now()->next('Saturday')->setTime(9, 0),
                'end_time' => now()->next('Saturday')->setTime(11, 0),
            ],
            [
                'title' => 'Pembukaan PPBQ Batch 6',
                'description' => 'Acara pembukaan Program Pemantapan Baca Quran Batch 6',
                'start_time' => now()->addDays(14)->setTime(8, 0),
                'end_time' => now()->addDays(14)->setTime(12, 0),
            ],
            [
                'title' => 'Rapat Pengurus Bulanan',
                'description' => 'Rapat evaluasi dan koordinasi bulanan',
                'start_time' => now()->addDays(7)->setTime(15, 0),
                'end_time' => now()->addDays(7)->setTime(17, 0),
            ],
        ];

        foreach ($events as $event) {
            Calendar::create($event);
        }

        // Create Contacts
        $contacts = [
            ['type' => 'email', 'detail' => 'baitulhikmah@upi.edu'],
            ['type' => 'whatsapp', 'detail' => '+6281234567890'],
            ['type' => 'instagram', 'detail' => '@baitulhikmah.upi'],
            ['type' => 'youtube', 'detail' => 'Baitulhikmah UPI'],
            ['type' => 'telegram', 'detail' => '@baitulhikmah_upi'],
        ];

        foreach ($contacts as $contact) {
            Contact::create($contact);
        }
    }
}
