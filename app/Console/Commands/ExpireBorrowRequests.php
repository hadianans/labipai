<?php

namespace App\Console\Commands;

use App\Models\BorrowRequest;
use Illuminate\Console\Command;

class ExpireBorrowRequests extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'borrow-requests:expire';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Expire borrow requests that are older than 1 hour';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $count = BorrowRequest::pending()
            ->where('expires_at', '<', now())
            ->update(['status' => BorrowRequest::STATUS_EXPIRED]);

        $this->info("Expired {$count} borrow requests.");
    }
}
