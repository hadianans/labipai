<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        // Create Categories
        $categories = [
            'Kajian Ilmiah',
            'Kegiatan Lab',
            'Tips & Trik',
            'Berita',
            'Opini',
        ];

        foreach ($categories as $catName) {
            Category::create(['name' => $catName]);
        }

        // Create Articles
        $articles = [
            [
                'title' => 'Pentingnya Membaca Al-Quran Setiap Hari',
                'excerpt' => 'Membaca Al-Quran setiap hari memiliki banyak keutamaan dan manfaat bagi kehidupan seorang muslim.',
                'content' => '<p>Membaca Al-Quran adalah salah satu amalan yang sangat dianjurkan dalam Islam. Rasulullah SAW bersabda, "Sebaik-baik kalian adalah yang mempelajari Al-Quran dan mengajarkannya."</p><p>Beberapa keutamaan membaca Al-Quran antara lain:</p><ul><li>Mendapat pahala yang berlipat ganda</li><li>Mendapat syafaat di hari kiamat</li><li>Hati menjadi tenang dan tentram</li><li>Mendapat petunjuk dalam kehidupan</li></ul>',
                'author' => 'Admin',
                'status' => '1',
                'categories' => [1, 3],
            ],
            [
                'title' => 'Dokumentasi Kegiatan PPBQ Batch 5',
                'excerpt' => 'Program Pemantapan Baca Quran (PPBQ) Batch 5 telah sukses dilaksanakan dengan diikuti oleh 50 peserta.',
                'content' => '<p>Alhamdulillah, Program Pemantapan Baca Quran (PPBQ) Batch 5 telah sukses dilaksanakan pada tanggal 1-30 November 2025. Program ini diikuti oleh 50 peserta dari berbagai program studi di UPI.</p><p>Kegiatan ini mencakup pembelajaran tajwid, makharijul huruf, dan praktik membaca Al-Quran dengan bimbingan ustadz/ustadzah yang kompeten.</p>',
                'author' => 'Admin',
                'status' => '1',
                'categories' => [2, 4],
            ],
            [
                'title' => 'Tips Menghafal Al-Quran dengan Mudah',
                'excerpt' => 'Berikut adalah beberapa tips yang dapat membantu Anda dalam menghafal Al-Quran dengan lebih mudah dan efektif.',
                'content' => '<p>Menghafal Al-Quran adalah impian setiap muslim. Berikut tips-tipsnya:</p><ol><li><strong>Niat yang ikhlas</strong> - Pastikan niat Anda hanya karena Allah</li><li><strong>Konsisten</strong> - Hafal sedikit tapi rutin lebih baik</li><li><strong>Waktu terbaik</strong> - Manfaatkan waktu setelah Subuh</li><li><strong>Muraja\'ah</strong> - Ulangi hafalan secara berkala</li><li><strong>Mushaf yang sama</strong> - Gunakan satu jenis mushaf</li></ol>',
                'author' => 'Admin',
                'status' => '1',
                'categories' => [3],
            ],
            [
                'title' => 'Pendaftaran PPBQ Batch 6 Dibuka!',
                'excerpt' => 'Laboratorium Baitulhikmah membuka pendaftaran Program Pemantapan Baca Quran (PPBQ) Batch 6.',
                'content' => '<p>Bismillah, Laboratorium Ilmu Pendidikan Agama Islam "Baitulhikmah" UPI membuka pendaftaran PPBQ Batch 6!</p><p><strong>Jadwal:</strong> Februari - Maret 2026</p><p><strong>Fasilitas:</strong></p><ul><li>Bimbingan intensif tajwid</li><li>Sertifikat</li><li>Modul pembelajaran</li></ul><p>Daftar sekarang melalui link di pengumuman!</p>',
                'author' => 'Admin',
                'status' => '1',
                'categories' => [2, 4],
            ],
            [
                'title' => 'Peran Laboratorium PAI dalam Pengembangan Kompetensi Mahasiswa',
                'excerpt' => 'Laboratorium PAI memiliki peran strategis dalam mengembangkan kompetensi mahasiswa calon guru PAI.',
                'content' => '<p>Laboratorium Pendidikan Agama Islam "Baitulhikmah" memiliki peran penting dalam:</p><ul><li>Mengembangkan kemampuan mengajar mahasiswa</li><li>Menyediakan sumber belajar yang lengkap</li><li>Memfasilitasi kegiatan kajian ilmiah</li><li>Menyelenggarakan program-program unggulan</li></ul>',
                'author' => 'Admin',
                'status' => '1',
                'categories' => [1, 5],
            ],
        ];

        foreach ($articles as $articleData) {
            $categoryIds = $articleData['categories'];
            unset($articleData['categories']);

            $articleData['slug'] = Str::slug($articleData['title']);

            $article = Article::create($articleData);
            $article->categories()->attach($categoryIds);
        }
    }
}
