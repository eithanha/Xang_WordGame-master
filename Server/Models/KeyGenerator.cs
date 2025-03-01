using System;
using System.Security.Cryptography;

public class KeyGenerator
{
    public static string GenerateSecureKey()
    {
        using (var randomNumberGenerator = new RNGCryptoServiceProvider())
        {
            byte[] key = new byte[32];  
            randomNumberGenerator.GetBytes(key);
            return Convert.ToBase64String(key);
        }
    }
}
