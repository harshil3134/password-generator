import { useState, useCallback, useEffect, useRef } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Analytics } from "@vercel/analytics/react"

export default function PasswordGenerator() {
  const [length, setLength] = useState(8);
  const [numberAllowed, setNumberAllowed] = useState(false);
  const [charAllowed, setCharAllowed] = useState(false);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const passwordRef = useRef(null);

  const passwordGenerator = useCallback(() => {
    let pass = "";
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    if (numberAllowed) str += "0123456789";
    if (charAllowed) str += "!@#$%^&*-_+=[]{}~`";
    for (let i = 1; i <= length; i++) {
      let char = Math.floor(Math.random() * str.length + 1);
      pass += str.charAt(char);
    }
    setPassword(pass);
  }, [length, numberAllowed, charAllowed]);

  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select();
    passwordRef.current?.setSelectionRange(0, 999);
    window.navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [password]);

  useEffect(() => {
    passwordGenerator();
  }, [length, numberAllowed, charAllowed, passwordGenerator]);

  const getPasswordStrength = () => {
    let strength = 0;
    if (length >= 8) strength++;
    if (length >= 12) strength++;
    if (numberAllowed) strength++;
    if (charAllowed) strength++;
    
    switch(strength) {
      case 0: return { text: "Very Weak", color: "bg-red-500" };
      case 1: return { text: "Weak", color: "bg-orange-500" };
      case 2: return { text: "Medium", color: "bg-yellow-500" };
      case 3: return { text: "Strong", color: "bg-green-500" };
      case 4: return { text: "Very Strong", color: "bg-emerald-500" };
      default: return { text: "Very Weak", color: "bg-red-500" };
    }
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center p-4">
 		

      <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-md w-full">
  <Analytics />
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-700">Password Generator</CardTitle>
            <CardDescription className="text-gray-500">Create secure passwords with custom settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="relative">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={password}
                  className="w-full px-3 py-2 border rounded-lg bg-gray-100 focus:outline-none"
                  placeholder="Generated Password"
                  readOnly
                  ref={passwordRef}
                />
                <Button 
                  onClick={copyPasswordToClipboard}
                  variant="outline"
                  className="flex items-center gap-2 text-sm"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
                <Button
                  onClick={passwordGenerator}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="mt-2 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full ${strength.color} transition-all duration-300`} 
                  style={{ width: `${(strength.text === 'Very Strong' ? 100 : strength.text === 'Strong' ? 75 : strength.text === 'Medium' ? 50 : strength.text === 'Weak' ? 25 : 10)}%` }}>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">Strength: {strength.text}</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Password Length: {length}</label>
                <Slider 
                  value={[length]}
                  onValueChange={([value]) => setLength(value)}
                  min={6}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-600">Include Numbers</label>
                <Switch
                  checked={numberAllowed}
                  onCheckedChange={setNumberAllowed}
                />
              </div>

              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-600">Include Special Characters</label>
                <Switch
                  checked={charAllowed}
                  onCheckedChange={setCharAllowed}
                />
              </div>
            </div>

            {length < 8 && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription className="text-red-600">
                  For better security, use at least 8 characters
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
