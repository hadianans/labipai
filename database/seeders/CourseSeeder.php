<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\CourseContent;
use App\Models\CourseModule;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
        $courses = [
            [
                'title' => 'Dasar-dasar Ilmu Tajwid',
                'description' => 'Kursus ini membahas ilmu tajwid dari dasar hingga mahir. Cocok untuk pemula yang ingin memperbaiki bacaan Al-Quran.',
                'level' => Course::LEVEL_BEGINNER,
                'status' => Course::STATUS_PUBLISHED,
                'modules' => [
                    [
                        'title' => 'Pengenalan Ilmu Tajwid',
                        'description' => 'Memahami definisi, hukum, dan keutamaan mempelajari tajwid',
                        'order' => 1,
                        'contents' => [
                            ['type' => CourseContent::TYPE_TEXT, 'title' => 'Pengertian Ilmu Tajwid', 'order' => 1],
                            ['type' => CourseContent::TYPE_TEXT, 'title' => 'Hukum Mempelajari Tajwid', 'order' => 2],
                            ['type' => CourseContent::TYPE_VIDEO, 'title' => 'Video: Pengantar Tajwid', 'content_url' => 'https://youtube.com/watch?v=example1', 'order' => 3],
                        ],
                    ],
                    [
                        'title' => 'Makharijul Huruf',
                        'description' => 'Mempelajari tempat-tempat keluarnya huruf hijaiyah',
                        'order' => 2,
                        'contents' => [
                            ['type' => CourseContent::TYPE_TEXT, 'title' => 'Lima Makhraj Utama', 'order' => 1],
                            ['type' => CourseContent::TYPE_TEXT, 'title' => 'Huruf-huruf Halqi', 'order' => 2],
                            ['type' => CourseContent::TYPE_TEXT, 'title' => 'Huruf-huruf Lisani', 'order' => 3],
                            ['type' => CourseContent::TYPE_VIDEO, 'title' => 'Video: Praktik Makharijul Huruf', 'content_url' => 'https://youtube.com/watch?v=example2', 'order' => 4],
                        ],
                    ],
                    [
                        'title' => 'Hukum Nun Sukun dan Tanwin',
                        'description' => 'Mempelajari hukum bacaan nun sukun dan tanwin',
                        'order' => 3,
                        'contents' => [
                            ['type' => CourseContent::TYPE_TEXT, 'title' => 'Idzhar Halqi', 'order' => 1],
                            ['type' => CourseContent::TYPE_TEXT, 'title' => 'Idgham', 'order' => 2],
                            ['type' => CourseContent::TYPE_TEXT, 'title' => 'Iqlab', 'order' => 3],
                            ['type' => CourseContent::TYPE_TEXT, 'title' => 'Ikhfa', 'order' => 4],
                            ['type' => CourseContent::TYPE_VIDEO, 'title' => 'Video: Praktik Hukum Nun', 'content_url' => 'https://youtube.com/watch?v=example3', 'order' => 5],
                        ],
                    ],
                ],
            ],
            [
                'title' => 'Pengantar Fiqih Ibadah',
                'description' => 'Mempelajari dasar-dasar fiqih ibadah meliputi thaharah, shalat, zakat, puasa, dan haji.',
                'level' => Course::LEVEL_INTERMEDIATE,
                'status' => Course::STATUS_PUBLISHED,
                'modules' => [
                    [
                        'title' => 'Thaharah (Bersuci)',
                        'description' => 'Memahami hukum dan tata cara bersuci',
                        'order' => 1,
                        'contents' => [
                            ['type' => CourseContent::TYPE_TEXT, 'title' => 'Pengertian Thaharah', 'order' => 1],
                            ['type' => CourseContent::TYPE_TEXT, 'title' => 'Wudhu dan Tayammum', 'order' => 2],
                            ['type' => CourseContent::TYPE_TEXT, 'title' => 'Mandi Wajib', 'order' => 3],
                        ],
                    ],
                    [
                        'title' => 'Shalat',
                        'description' => 'Mempelajari hukum dan tata cara shalat',
                        'order' => 2,
                        'contents' => [
                            ['type' => CourseContent::TYPE_TEXT, 'title' => 'Syarat dan Rukun Shalat', 'order' => 1],
                            ['type' => CourseContent::TYPE_TEXT, 'title' => 'Shalat Wajib Lima Waktu', 'order' => 2],
                            ['type' => CourseContent::TYPE_TEXT, 'title' => 'Shalat Sunnah', 'order' => 3],
                            ['type' => CourseContent::TYPE_VIDEO, 'title' => 'Video: Tata Cara Shalat', 'content_url' => 'https://youtube.com/watch?v=example4', 'order' => 4],
                        ],
                    ],
                ],
            ],
            [
                'title' => 'Sejarah Peradaban Islam',
                'description' => 'Mengenal sejarah perkembangan peradaban Islam dari masa Rasulullah hingga era modern.',
                'level' => Course::LEVEL_ADVANCED,
                'status' => Course::STATUS_DRAFT,
                'modules' => [
                    [
                        'title' => 'Masa Rasulullah SAW',
                        'description' => 'Periode awal Islam di Makkah dan Madinah',
                        'order' => 1,
                        'contents' => [
                            ['type' => CourseContent::TYPE_TEXT, 'title' => 'Periode Makkah', 'order' => 1],
                            ['type' => CourseContent::TYPE_TEXT, 'title' => 'Periode Madinah', 'order' => 2],
                        ],
                    ],
                ],
            ],
            [
                'title' => 'Ilmu Kalam',
                'description' => 'Mempelajari ilmu kalam dari dasar hingga mahir.',
                'level' => Course::LEVEL_EXPERT,
                'status' => Course::STATUS_PUBLISHED,
                'modules' => [
                    [
                        'title' => 'Ilmu Kalam Dasar',
                        'description' => 'Mempelajari ilmu kalam dasar',
                        'order' => 1,
                        'contents' => [
                            ['type' => CourseContent::TYPE_TEXT, 'title' => 'Ilmu Kalam Dasar', 'order' => 1],
                            ['type' => CourseContent::TYPE_TEXT, 'title' => 'Ilmu Kalam Mahir', 'order' => 2],
                        ],
                    ],
                ],
            ],
        ];

        foreach ($courses as $courseData) {
            $modules = $courseData['modules'];
            unset($courseData['modules']);

            $course = Course::create($courseData);

            foreach ($modules as $moduleData) {
                $contents = $moduleData['contents'];
                unset($moduleData['contents']);

                $module = $course->modules()->create($moduleData);

                foreach ($contents as $contentData) {
                    $module->contents()->create($contentData);
                }
            }
        }
    }
}
