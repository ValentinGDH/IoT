int L = 7; //variable pour le numéro du pin utilisé

void setup()
{
    pinMode(L,OUTPUT); //le pin 13 en mode sortie de courant
}

void loop()
{
    digitalWrite(L,HIGH); // on passe le pin à +5V
    delay (500);
    digitalWrite(L,LOW); // on passe le pin à 0V
    delay(500);
}
