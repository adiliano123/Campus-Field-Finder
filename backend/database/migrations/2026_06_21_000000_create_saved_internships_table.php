<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSavedInternshipsTable extends Migration
{
    public function up()
    {
        Schema::create('saved_internships', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->foreignId('internship_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            $table->unique(['student_id', 'internship_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('saved_internships');
    }
}
