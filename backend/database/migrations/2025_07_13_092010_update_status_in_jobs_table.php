<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB; // Add DB import

class UpdateStatusInJobsTable extends Migration
{
    // Update status column in jobs table
    public function up()
    {
        Schema::table('jobs', function (Blueprint $table) {
            // Update existing status values to new enum
            DB::statement("ALTER TABLE jobs MODIFY status ENUM('closed', 'active', 'draft', 'filled') DEFAULT 'draft'");
            // Map 'published' to 'active'
            DB::table('jobs')->where('status', 'published')->update(['status' => 'active']);
        });
    }

    // Revert status column
    public function down()
    {
        Schema::table('jobs', function (Blueprint $table) {
            DB::statement("ALTER TABLE jobs MODIFY status ENUM('draft', 'published') DEFAULT 'draft'");
            DB::table('jobs')->where('status', 'active')->update(['status' => 'published']);
        });
    }
}
