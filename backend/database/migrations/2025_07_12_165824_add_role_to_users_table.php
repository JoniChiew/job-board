<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddRoleToUsersTable extends Migration
{
    // Add role column to users table
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['employer', 'applicant'])->default('applicant')->after('password');
        });
    }

    // Remove role column
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role');
        });
    }
}
