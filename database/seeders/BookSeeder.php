<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\Genre;
use Illuminate\Database\Seeder;

class BookSeeder extends Seeder
{
    public function run(): void
    {
        // Create Genres
        $genres = [
            'Fiqh',
            'Tafsir',
            'Hadits',
            'Akidah',
            'Sirah',
            'Tasawuf',
            'Pendidikan Islam',
            'Bahasa Arab',
        ];

        foreach ($genres as $genreName) {
            Genre::create(['name' => $genreName]);
        }

        // Create Books
        $books = [
            [
                'title' => 'Fiqh Islam Wa Adillatuhu',
                'author' => 'Dr. Wahbah Az-Zuhaili',
                'editor' => 'Ahmad Jamil',
                'translator' => 'Abdul Hayyie',
                'publisher' => 'Darul Fikr',
                'year' => 2011,
                'language' => 'Indonesia',
                'page' => 650,
                'volume' => 1,
                'synopsis' => 'Kitab fiqh komprehensif yang membahas berbagai masalah fiqh kontemporer dengan dalil-dalil yang lengkap.',
                'isbn' => '978-979-123-456-1',
                'type' => Book::TYPE_OPEN_ACCESS,
                'status' => Book::STATUS_AVAILABLE,
                'genres' => [1, 7], // Fiqh, Pendidikan Islam
                'is_show' => Book::TYPE_SHOW,
            ],
            [
                'title' => 'Tafsir Ibnu Katsir',
                'author' => 'Ibnu Katsir',
                'editor' => 'Imam Syafi\'i',
                'translator' => 'Fadhli Bahri',
                'publisher' => 'Pustaka Imam Asy-Syafi\'i',
                'year' => 2017,
                'language' => 'Indonesia',
                'page' => 800,
                'volume' => 1,
                'synopsis' => 'Tafsir Al-Quran yang paling populer dengan metode tafsir bil ma\'tsur.',
                'isbn' => '978-979-123-456-2',
                'type' => Book::TYPE_OPEN_ACCESS,
                'status' => Book::STATUS_AVAILABLE,
                'genres' => [2], // Tafsir
                'is_show' => Book::TYPE_SHOW,
            ],
            [
                'title' => 'Riyadhus Shalihin',
                'author' => 'Imam An-Nawawi',
                'publisher' => 'Darul Haq',
                'year' => 2018,
                'language' => 'Indonesia',
                'page' => 550,
                'synopsis' => 'Kumpulan hadits-hadits pilihan tentang akhlak dan adab.',
                'isbn' => '978-979-123-456-3',
                'type' => Book::TYPE_OPEN_ACCESS,
                'status' => Book::STATUS_AVAILABLE,
                'genres' => [3], // Hadits
                'is_show' => Book::TYPE_SHOW,
            ],
            [
                'title' => 'Aqidah Wasithiyyah',
                'author' => 'Ibnu Taimiyah',
                'publisher' => 'Pustaka At-Tibyan',
                'year' => 2019,
                'language' => 'Indonesia',
                'page' => 200,
                'synopsis' => 'Kitab aqidah yang menjelaskan pokok-pokok keimanan menurut Ahlus Sunnah wal Jamaah.',
                'isbn' => '978-979-123-456-4',
                'type' => Book::TYPE_OPEN_ACCESS,
                'status' => Book::STATUS_AVAILABLE,
                'genres' => [4], // Akidah
                'is_show' => Book::TYPE_SHOW,
            ],
            [
                'title' => 'Sirah Nabawiyah',
                'author' => 'Syaikh Shafiyyurrahman Al-Mubarakfuri',
                'publisher' => 'Pustaka Al-Kautsar',
                'year' => 2020,
                'language' => 'Indonesia',
                'page' => 700,
                'synopsis' => 'Kisah perjalanan hidup Nabi Muhammad SAW yang lengkap dan terperinci.',
                'isbn' => '978-979-123-456-5',
                'type' => Book::TYPE_OPEN_ACCESS,
                'status' => Book::STATUS_AVAILABLE,
                'genres' => [5], // Sirah
                'is_show' => Book::TYPE_SHOW,
            ],
            [
                'title' => 'Ihya Ulumuddin',
                'author' => 'Imam Al-Ghazali',
                'publisher' => 'Darul Kutub',
                'year' => 2015,
                'language' => 'Indonesia',
                'page' => 1200,
                'volume' => 1,
                'synopsis' => 'Masterpiece karya Imam Al-Ghazali tentang ilmu-ilmu agama dan tasawuf.',
                'isbn' => '978-979-123-456-6',
                'type' => Book::TYPE_RESTRICTED,
                'status' => Book::STATUS_AVAILABLE,
                'genres' => [6], // Tasawuf
                'is_show' => Book::TYPE_SHOW,
            ],
            [
                'title' => 'Metodologi Pendidikan Islam',
                'author' => 'Prof. Dr. Ahmad Tafsir',
                'publisher' => 'PT Remaja Rosdakarya',
                'year' => 2021,
                'language' => 'Indonesia',
                'page' => 300,
                'synopsis' => 'Buku tentang metodologi pengajaran dalam pendidikan Islam.',
                'isbn' => '978-979-123-456-7',
                'type' => Book::TYPE_OPEN_ACCESS,
                'status' => Book::STATUS_AVAILABLE,
                'genres' => [7], // Pendidikan Islam
                'is_show' => Book::TYPE_SHOW,
            ],
            [
                'title' => 'Durusul Lughah Al-Arabiyyah',
                'author' => 'Dr. V. Abdur Rahim',
                'publisher' => 'Islamic Foundation',
                'year' => 2016,
                'language' => 'Arab-Indonesia',
                'page' => 250,
                'volume' => 1,
                'synopsis' => 'Buku belajar bahasa Arab untuk pemula dengan metode langsung.',
                'isbn' => '978-979-123-456-8',
                'type' => Book::TYPE_OPEN_ACCESS,
                'status' => Book::STATUS_AVAILABLE,
                'genres' => [8], // Bahasa Arab
                'is_show' => Book::TYPE_SHOW,
            ],
            [
                'title' => 'Bulughul Maram',
                'author' => 'Ibnu Hajar Al-Asqalani',
                'publisher' => 'Dar Ibn Hazm',
                'year' => 2019,
                'language' => 'Indonesia',
                'page' => 450,
                'synopsis' => 'Kitab hadits hukum yang menjadi rujukan dalam masalah fiqh.',
                'isbn' => '978-979-123-456-9',
                'type' => Book::TYPE_OPEN_ACCESS,
                'status' => Book::STATUS_AVAILABLE,
                'genres' => [1, 3], // Fiqh, Hadits
                'is_show' => Book::TYPE_SHOW,
            ],
            [
                'title' => 'Tarbiyatul Aulad fil Islam',
                'author' => 'Abdullah Nashih Ulwan',
                'publisher' => 'Pustaka Amani',
                'year' => 2020,
                'language' => 'Indonesia',
                'page' => 500,
                'synopsis' => 'Panduan komprehensif mendidik anak dalam Islam.',
                'isbn' => '978-979-123-456-10',
                'type' => Book::TYPE_OPEN_ACCESS,
                'status' => Book::STATUS_AVAILABLE,
                'genres' => [7], // Pendidikan Islam
                'is_show' => Book::TYPE_SHOW,
            ],
        ];

        foreach ($books as $bookData) {
            $genreIds = $bookData['genres'];
            unset($bookData['genres']);

            $book = Book::create($bookData);
            $book->genres()->attach($genreIds);
        }
    }
}
