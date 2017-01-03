<?php
 
if(isset($_POST['contactInputEmail'])) {
 
     
    // EDIT THE 2 LINES BELOW AS REQUIRED
 
    $email_to = "azugfr@outlook.com"; // change this email to the one you want to receive your emails
 
    $email_subject = "Demande d'information depuis site web"; // subject of every message received from the website
 
 
    function died($error) {
 
        // your error code can go here
 
        echo "Nous sommes désolés, il y a des erreurs dans votre formulaire d'envoi. ";
 
        echo "Des erreurs apparaissent ci-dessous.<br /><br />";
 
        echo $error."<br /><br />";
 
        echo "Merci de recommencer pour corriger ces erreurs.<br /><br />";
 
        die();
 
    }
 
     
 
    // validation expected data exists
 
    if(!isset($_POST['contactName']) ||
 
        !isset($_POST['contactInputEmail']) ||

        !isset($_POST['contactMessage'])) {
 
        died("Nous sommes désolés, il y a des erreurs dans votre formulaire d'envoi.");       
 
    }
 
     
 
    $first_name = $_POST['contactName']; // required
 
    $email_from = $_POST['contactInputEmail']; // required
 
    $message = $_POST['contactMessage']; // required
 
     
 
    $error_message = "";
 
    $email_exp = '/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/';
 
  if(!preg_match($email_exp,$email_from)) {
 
    $error_message .= 'Cette adresse email est incorrecte.<br />';
 
  }
 
    $string_exp = "/^[A-Za-z .'-]+$/";
 
  if(!preg_match($string_exp,$first_name)) {
 
    $error_message .= 'Ce prénom semble incorrect.<br />';
 
  }
 
 
  if(strlen($message) < 2) {
 
    $error_message .= 'Votre message semble incorrect.<br />';
 
  }
 
  if(strlen($error_message) > 0) {
 
    died($error_message);
 
  }
 
    $email_message = "Form details below.\n\n";
 
     
 
    function clean_string($string) {
 
      $bad = array("content-type","bcc:","to:","cc:","href");
 
      return str_replace($bad,"",$string);
 
    }
 
     
 
    $email_message .= "Nom: ".clean_string($first_name)."\n";

    $email_message .= "Email: ".clean_string($email_from)."\n";

    $email_message .= "Message: ".clean_string($comments)."\n";
 
     
 
     
 
// create email headers
 
$headers = 'From: '.$email_from."\r\n".
 
'Reply-To: '.$email_from."\r\n" .
 
'X-Mailer: PHP/' . phpversion();
 
@mail($email_to, $email_subject, $email_message, $headers);  
 
?>
 
 
 
<!-- include your own success html here -->
 
 
 
Merci pour votre message, nous vous contactons dans les plus brefs délais.
 
 
 
<?php
 
}
 
?>