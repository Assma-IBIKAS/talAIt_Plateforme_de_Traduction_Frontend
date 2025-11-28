"use client";

import { useState } from "react";

export default function TranslatePage() {
  const [text, setText] = useState("");
  const [direction, setDirection] = useState<"fr-en" | "en-fr">("fr-en");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = "http://localhost:8000";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("Vous devez être connecté pour traduire");
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/translate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ text, direction }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Erreur lors de la traduction");
        setLoading(false);
        return;
      }

      setResult(data.translation);
    } catch (err) {
      console.error(err);
      setError("Erreur réseau ou serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-200 via-pink-200 to-yellow-200 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">
          Traduction
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            placeholder="Tapez votre texte ici..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />

          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value as "fr-en" | "en-fr")}
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="fr-en">Français → Anglais</option>
            <option value="en-fr">Anglais → Français</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition-all font-semibold"
          >
            {loading ? "Traduction en cours..." : "Traduire"}
          </button>
        </form>

        {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
        {result && (
          <div className="mt-4 p-4 border rounded-xl bg-gray-100">
            <h3 className="font-semibold mb-2">Résultat :</h3>
            <p>{result}</p>
          </div>
        )}
      </div>
    </div>
  );
}
