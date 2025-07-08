// src/components/QASection.tsx
import React, { useState } from "react";
import api from "../services/api";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

interface Props {
  documentId: string;
}

const QASection: React.FC<Props> = ({ documentId }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;

    setLoading(true);
    try {
      const res = await api.post<{ answer: string }>(`/qa/${documentId}`, { question });
      setAnswer(res.data.answer);
    } catch (err) {
      console.error(err);
      setAnswer("Error getting answer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ mt: 4, p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Ask a question about this document:
      </Typography>

      <Box display="flex" gap={2} mb={2}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your question..."
        />
        <Button
          variant="contained"
          onClick={handleAsk}
          disabled={loading}
          sx={{ whiteSpace: "nowrap" }}
        >
          {loading ? <CircularProgress size={20} /> : "Ask"}
        </Button>
      </Box>

      {answer && (
        <Typography variant="body1" color="text.primary">
          <strong>Answer:</strong> {answer}
        </Typography>
      )}
    </Paper>
  );
};

export default QASection;
