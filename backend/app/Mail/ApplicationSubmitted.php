<?php

namespace App\Mail;

use App\Models\Application;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ApplicationSubmitted extends Mailable
{
    use Queueable, SerializesModels;

   public $application;

   Constructor to receive application data
   public function __construct(Application $application)
   {
       $this->application = $application;
   }

   Build the email
   public function build()
   {
       return $this->subject('Application Submitted')
           ->view('emails.application_submitted')
           ->with(['application' => $this->application]);
    }
}
