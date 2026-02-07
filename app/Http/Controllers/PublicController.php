<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PublicController extends Controller
{
    public function index()
    {
        // 1. Hero Slides (Gallery)
        $heroImages = \App\Models\Gallery::where('is_hero', true)->orderBy('id', 'asc')->limit(3)->get();

        // Ensure at least 3 slides by repeating if necessary, or fallback if empty
        $slidesData = collect();
        if ($heroImages->isEmpty()) {
            // Fallback if no hero images
            $slidesData->push(['image' => null]);
            $slidesData->push(['image' => null]);
            $slidesData->push(['image' => null]);
        } else {
            $index = 0;
            while ($slidesData->count() < 3) {
                $slidesData->push(['image' => '/storage/' . $heroImages[$index % $heroImages->count()]->img_url]);
                $index++;
            }
        }

        // Define separate buttons/content for each slide
        $slides = $slidesData->map(function ($item, $key) {
            $buttons = [
                0 => [
                    'text' => 'Book Catalog',
                    'url' => '/books',
                    'icon' => 'book' // conceptual
                ],
                1 => [
                    'text' => 'Explore Courses',
                    'url' => '/courses',
                    'icon' => 'academic'
                ],
                2 => [
                    'text' => 'Contact Us',
                    'url' => '/contact',
                    'icon' => 'chat'
                ]
            ];

            $content = [
                0 => [
                    'title' => 'Laboratorium IPAI UPI',
                    'subtitle' => 'Tempat diskusi kajian ilmiah mahasiswa prodi IPAI. Lihatlah koleksi buku kami!'
                ],
                1 => [
                    'title' => 'Program Unggulan',
                    'subtitle' => 'Kami aktif menyelenggarakan program yang benar-benar bermanfaat, kalian juga bisa belajar bersama kami. Lihatlah kelas kelas ini!'
                ],
                2 => [
                    'title' => 'Tak Kenal maka Tanyakan',
                    'subtitle' => 'hubungi kami untuk informasi layanan akademik atau teman curhat'
                ]
            ];

            return [
                'title' => $content[$key]['title'] ?? 'Baitulhikmah Library',
                'subtitle' => $content[$key]['subtitle'] ?? 'Cultivating minds, enriching souls.',
                'image' => $item['image'],
                'button' => $buttons[$key] ?? $buttons[0]
            ];
        });

        // 2. Vision
        $vision = \App\Models\Vision::where('is_active', true)->latest('year')->first();

        // 3. Stats
        $stats = [
            'books' => \App\Models\Book::count(),
            'active_loans' => \App\Models\BookLend::whereNull('returned_at')->count(),
            'programs' => \App\Models\Program::count(),
            'users' => \App\Models\User::count(),
        ];

        // 4. Programs
        $programs = \App\Models\Program::all();

        // 5. Random Books (8)
        $randomBooks = \App\Models\Book::where('is_show', true)
            ->inRandomOrder()
            ->limit(8)
            ->get()
            ->map(function ($book) {
                return [
                    'id' => $book->id,
                    'title' => $book->title,
                    'author' => $book->author,
                    'img_url' => $book->img_url ? '/storage/' . $book->img_url : null,
                    'rating' => $book->reviews()->avg('star') ?? 0,
                ];
            });

        // 6. Contact
        $contactsRaw = \App\Models\Contact::all();
        $contacts = $contactsRaw->mapWithKeys(function ($item) {
            return [$item->type => $item->detail];
        });

        return \Inertia\Inertia::render('Public/Home', [
            'slides' => $slides,
            'vision' => $vision,
            'stats' => $stats,
            'programs' => $programs,
            'randomBooks' => $randomBooks,
            'contacts' => $contacts,
        ]);
    }

    public function books(Request $request)
    {
        $query = \App\Models\Book::query();

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('author', 'like', "%{$search}%");
            });
        }

        // Filter by Genre (if implemented in frontend as 'genre')
        if ($request->filled('genre') && $request->genre !== 'All') {
            $genre = $request->genre;
            $query->whereHas('genres', function ($q) use ($genre) {
                $q->where('name', $genre);
            });
        }

        // Only show books marked for display (handles duplicate grouping)
        $query->where('is_show', true);

        $books_pagination = $query->latest()->paginate(12)->withQueryString();

        // Transform collection to add status_label and reviews_count if not in model
        // Using map on items, but pagination returns LengthAwarePaginator.
        // Better to use API Resource, but for quick implementation via Inertia:
        $books_pagination->getCollection()->transform(function ($book) {
            return [
                'id' => $book->id,
                'title' => $book->title,
                'author' => $book->author,
                'publisher' => $book->publisher,
                'year' => $book->year,
                'isbn' => $book->isbn,
                'page' => $book->page,
                'volume' => $book->volume,
                'language' => $book->language,
                'synopsis' => $book->synopsis,
                'status' => $book->status,
                'status_label' => match ($book->status) {
                    '0' => 'Tersedia',
                    '1' => 'Dipinjam',
                    '2' => 'Hilang',
                    default => 'Unknown'
                },
                'type' => $book->type,
                'img_url' => $book->img_url ? '/storage/' . $book->img_url : null, // Ensure full path if stored as relative
                'rating' => 4.5, // Placeholder or relation
                'reviews_count' => 0 // Placeholder or relation
            ];
        });

        // Use 'books' as key for Inertia
        return \Inertia\Inertia::render('Public/Books/Index', [
            // Inertia expects 'books' to be the paginator object (usually) or data array.
            // Frontend expects `books` prop. Currently mock data was array.
            // If I pass paginator, `books.data` is the array.
            // The current frontend `Index.jsx` uses `books.filter(...)` which implies it expects an Array.
            // If I pass pagination object, it breaks `books.filter`.
            // I should pass `$books_pagination->items()` or Refactor Frontend to handle pagination.
            // For now, to satisfy "Show database books" without breaking UI logic completely:
            // I'll return `books_pagination->items()` (array) but this loses pagination links.
            // The user didn't ask for pagination UI, but filtering/search logic is in frontend in current Index.jsx!
            // Wait, `Index.jsx` lines 13-19 do Frontend Filtering.
            // So I should pass ALL books? Or refactor frontend?
            // Since the code I saw in `Index.jsx` has client-side filtering (`books.filter...`),
            // fetching ALL books might be heavy but safest for "keep existing frontend logic working".
            // However, `PublicController` mock data was small.
            // I will fetch `get()` instead of `paginate()` to mimic current behavior and let frontend filter.
            // But if DB is large, this is bad.
            // I will implement server-side filtering (already wrote query logic) and pass the result.
            // If I pass filtered result, frontend filter will just re-filter (and find match).
            // But Frontend `selectedGenre` state default is 'All'.
            // I should probably just return `get()` for now to match exactly the `books` prop expectation (Array).
            'books' => $query->get()->map(function ($book) {
                // Fetch copies for this book
                $copies = [];
                $myCopy = \App\Models\BookCopy::where('book_id', $book->id)->first();

                if ($myCopy) {
                    $copies = \App\Models\Book::join('book_copy', 'book.id', '=', 'book_copy.book_id')
                        ->where('book_copy.duplicate_code', $myCopy->duplicate_code)
                        ->select('book.id', 'book.status')
                        ->orderBy('book.id')
                        ->get()
                        ->map(function ($b) {
                            return [
                                'id' => (string) $b->id,
                                'status' => (string) $b->status,
                            ];
                        })->toArray();
                } else {
                    $copies = [['id' => (string) $book->id, 'status' => (string) $book->status]];
                }

                return [
                    'id' => $book->id,
                    'title' => $book->title,
                    'author' => $book->author,
                    'publisher' => $book->publisher,
                    'year' => $book->year,
                    'isbn' => $book->isbn,
                    'page' => $book->page,
                    'volume' => $book->volume,
                    'language' => $book->language,
                    'synopsis' => $book->synopsis,
                    'status' => $book->status,
                    'status_label' => match ((string) $book->status) {
                        '0', 0 => 'Tersedia',
                        '1', 1 => 'Dipinjam',
                        '2', 2 => 'Hilang',
                        default => 'Unknown'
                    },
                    'type' => $book->type,
                    'img_url' => $book->img_url ? '/storage/' . $book->img_url : null,
                    'rating' => 5.0,
                    'reviews_count' => 0,
                    'copies' => $copies
                ];
            })
        ]);
    }

    public function show($id)
    {
        $bookModel = \App\Models\Book::with(['genres'])->findOrFail($id);
        $user = auth()->user();

        // 1. Check Favorite Status
        $is_favorited = $user ? $user->bookFavorites()->where('book_id', $id)->exists() : false;

        // 2. Check Borrow Status for this User
        // We need to know if THIS user has a pending request, or if the book is currently borrowed by this user.
        $my_active_request = null;
        if ($user) {
            $my_active_request = \App\Models\BorrowRequest::where('book_id', $id)
                ->where('user_id', $user->id)
                ->whereIn('status', ['pending', 'approved'])
                ->latest()
                ->first();
        }

        // 3. Check if available generally (exclude if pending by others or borrowed)
        // actually existing status logic on model handles 'borrowed' (1).
        // We just need to check pending by OTHERS.
        $pending_by_others = \App\Models\BorrowRequest::where('book_id', $id)
            ->where('status', 'pending')
            ->where('expires_at', '>', now())
            ->when($user, function ($q) use ($user) {
                $q->where('user_id', '!=', $user->id);
            })
            ->exists();

        $book = [
            'id' => $bookModel->id,
            'title' => $bookModel->title,
            'author' => $bookModel->author,
            'publisher' => $bookModel->publisher,
            'year' => $bookModel->year,
            'isbn' => $bookModel->isbn,
            'page' => $bookModel->page,
            'volume' => $bookModel->volume,
            'language' => $bookModel->language,
            'synopsis' => $bookModel->synopsis,
            'status' => $bookModel->status, // 0: Available, 1: Borrowed, 2: Lost
            'status_label' => match ((string) $bookModel->status) {
                '0', 0 => 'Tersedia',
                '1', 1 => 'Dipinjam',
                '2', 2 => 'Hilang',
                default => 'Unknown'
            },
            'type' => $bookModel->type,
            'img_url' => $bookModel->img_url ? '/storage/' . $bookModel->img_url : null,
            'rating' => $bookModel->reviews()->avg('star') ?? 0,
            'reviews_count' => $bookModel->reviews()->count(),
            'copies' => (function () use ($bookModel) {
                $myCopy = \App\Models\BookCopy::where('book_id', $bookModel->id)->first();
                if ($myCopy) {
                    return \App\Models\Book::join('book_copy', 'book.id', '=', 'book_copy.book_id')
                        ->where('book_copy.duplicate_code', $myCopy->duplicate_code)
                        ->select('book.id', 'book.status')
                        ->orderBy('book.id')
                        ->get()
                        ->map(function ($b) {
                            return [
                                'id' => (string) $b->id,
                                'status' => (string) $b->status,
                                'status_label' => match ((string) $b->status) {
                                    '0', 0 => 'Available',
                                    '1', 1 => 'Borrowed',
                                    '2', 2 => 'Lost',
                                    default => 'Unknown'
                                },
                            ];
                        });
                } else {
                    return collect([
                        [
                            'id' => (string) $bookModel->id,
                            'status' => (string) $bookModel->status,
                            'status_label' => match ((string) $bookModel->status) {
                                '0', 0 => 'Available',
                                '1', 1 => 'Borrowed',
                                '2', 2 => 'Lost',
                                default => 'Unknown'
                            },
                        ]
                    ]);
                }
            })(),

            // Computed Status for UI
            'is_favorited' => $is_favorited,
            'my_request' => $my_active_request, // Object or null
            'is_pending_by_others' => $pending_by_others,
        ];

        // Load Reviews with User Info
        // Assuming BookReview model has 'user' relationship
        $reviews = $bookModel->reviews()
            ->with('user:id,username,img_url') // Select minimal fields
            ->latest()
            ->get()
            ->map(function ($review) {
                return [
                    'id' => $review->id,
                    'user_id' => $review->user_id,
                    'user' => $review->user ? $review->user->username : 'Anonymous',
                    'user_avatar' => $review->user ? ($review->user->img_url ?? null) : null,
                    'star' => $review->star,
                    'review' => $review->review,
                    'created_at' => $review->created_at,
                    'date' => $review->created_at->format('Y-m-d'), // specialized format if needed
                ];
            });

        return \Inertia\Inertia::render('Public/Books/Show', [
            'book' => $book,
            'reviews' => $reviews
        ]);
    }

    public function articles(Request $request)
    {
        $query = \App\Models\Article::published()
            ->with(['categories', 'assets']);

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%");
            });
        }

        // Filter by Category
        if ($request->filled('category')) {
            $query->whereHas('categories', function ($q) use ($request) {
                $q->where('name', $request->category);
            });
        }

        $articles = $query->latest()->paginate(9)->withQueryString();
        $categories = \App\Models\Category::all();

        return \Inertia\Inertia::render('Public/Articles/Index', compact('articles', 'categories'));
    }

    public function showArticle($slug)
    {
        $article = \App\Models\Article::published()
            ->where('slug', $slug)
            ->with(['categories', 'assets'])
            ->firstOrFail();

        // Get related articles (same category)
        $relatedArticles = \App\Models\Article::published()
            ->where('article.id', '!=', $article->id)
            ->whereHas('categories', function ($q) use ($article) {
                $q->whereIn('category.id', $article->categories->pluck('id'));
            })
            ->limit(3)
            ->get();

        return \Inertia\Inertia::render('Public/Articles/Show', compact('article', 'relatedArticles'));
    }

    public function gallery(Request $request)
    {
        $query = \App\Models\Gallery::with('tags');

        // Filter by Tag
        if ($request->filled('tag')) {
            $query->whereHas('tags', function ($q) use ($request) {
                $q->where('name', $request->tag);
            });
        }

        $gallery = $query->latest()->get(); // Gallery usually loaded all or infinite scroll, using get for now or paginate if needed. Let's use get for simplicity as per requirement "filter based on tag".
        // Actually paginate is better for performance if many images. But requirement didn't specify, "tampilan gallery sudah rapi...".
        // Let's stick to get() for now as it might be a simple grid, or paginate(12). Let's use paginate(12) to be safe.
        $gallery = $query->latest()->paginate(12)->withQueryString();

        $tags = \App\Models\Tag::all();

        return \Inertia\Inertia::render('Public/Gallery/Index', compact('gallery', 'tags'));
    }

    public function about()
    {
        $vision = \App\Models\Vision::where('is_active', true)->with('missions')->latest('year')->first();
        // Fallback if no active vision, maybe get latest? But requirements say "Vision displayed are with is_active set to TRUE".

        $administrators = \App\Models\Administrator::where('is_active', true)
            ->orderBy('is_chief', 'desc') // Chiefs first
            ->orderBy('year', 'desc')
            ->get();

        $programs = \App\Models\Program::all();

        return \Inertia\Inertia::render('Public/About', [
            'vision' => $vision,
            'administrators' => $administrators,
            'programs' => $programs
        ]);
    }

    public function contact()
    {
        $contactsRaw = \App\Models\Contact::all();
        $contacts = $contactsRaw->mapWithKeys(function ($item) {
            return [$item->type => $item->detail];
        });

        return \Inertia\Inertia::render('Public/Contact', [
            'contacts' => $contacts
        ]);
    }

    public function courses()
    {
        return \Inertia\Inertia::render('Public/Courses/Index');
    }
}
