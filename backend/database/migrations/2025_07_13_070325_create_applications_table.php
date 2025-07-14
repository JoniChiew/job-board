<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateApplicationsTable extends Migration
{
    // Create applications table
    public function up()
    {
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Applicant ID
            $table->foreignId('job_id')->constrained()->onDelete('cascade'); // Job ID
            $table->text('message')->nullable(); // Short message from applicant
            $table->string('resume')->nullable(); // Add resume field for storing file path
            $table->enum('status', ['pending', 'accepted', 'rejected'])->default('pending');
            $table->timestamps();
        });
    }

    // Drop applications table
    public function down()
    {
        Schema::dropIfExists('applications');
    }
}
