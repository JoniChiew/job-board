<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateJobsTable extends Migration
{
    // Create jobs table
    public function up()
    {
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Employer ID
            $table->string('title');
            $table->text('description');
            $table->string('location');
            $table->string('salary_range')->nullable();
            $table->boolean('is_remote')->default(false);
            $table->enum('status', ['draft', 'published'])->default('draft');
            $table->timestamps();
        });
    }

    // Drop jobs table
    public function down()
    {
        Schema::dropIfExists('jobs');
    }
}
