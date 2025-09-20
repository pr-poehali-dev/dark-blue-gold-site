import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface Question {
  question: string;
  options: string[];
  correct: number;
}

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    category: ''
  });
  
  const [questions, setQuestions] = useState<Question[]>([
    { question: '', options: ['', '', '', ''], correct: 0 }
  ]);

  const handleQuizChange = (field: string, value: string) => {
    setQuizData(prev => ({ ...prev, [field]: value }));
  };

  const handleQuestionChange = (index: number, field: string, value: string | number) => {
    const newQuestions = [...questions];
    if (field === 'question') {
      newQuestions[index].question = value as string;
    } else if (field === 'correct') {
      newQuestions[index].correct = value as number;
    }
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correct: 0 }]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullQuizData = { ...quizData, questions };
    console.log('Quiz data:', fullQuizData);
    
    const quizId = Date.now().toString();
    navigate(`/quiz/${quizId}`);
  };

  const generateQRCode = (content: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(content)}`;
  };

  return (
    <div className="min-h-screen bg-navy-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="border-gold-950 text-gold-950 hover:bg-gold-950/10"
            >
              <Icon name="ArrowLeft" size={20} className="mr-2" />
              Назад к главной
            </Button>
          </div>

          <Card className="game-card vintage-frame mb-8">
            <div className="vintage-corner top-left"></div>
            <div className="vintage-corner top-right"></div>
            <div className="vintage-corner bottom-left"></div>
            <div className="vintage-corner bottom-right"></div>
            
            <CardHeader className="text-center">
              <Icon name="Brain" size={48} className="text-gold-950 mx-auto mb-4" />
              <CardTitle className="text-2xl text-gold-950">Создать Квиз</CardTitle>
              <CardDescription className="text-gold-200">
                Создайте интерактивный квиз с вопросами и ответами
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-gold-950 font-medium">
                      Название квиза
                    </Label>
                    <Input
                      id="title"
                      value={quizData.title}
                      onChange={(e) => handleQuizChange('title', e.target.value)}
                      placeholder="Введите название квиза"
                      className="border-gold-950/30 focus:border-gold-950 bg-navy-800/50 text-gold-200"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-gold-950 font-medium">
                      Категория
                    </Label>
                    <Input
                      id="category"
                      value={quizData.category}
                      onChange={(e) => handleQuizChange('category', e.target.value)}
                      placeholder="Технологии, История..."
                      className="border-gold-950/30 focus:border-gold-950 bg-navy-800/50 text-gold-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gold-950 font-medium">
                    Описание
                  </Label>
                  <Textarea
                    id="description"
                    value={quizData.description}
                    onChange={(e) => handleQuizChange('description', e.target.value)}
                    placeholder="Краткое описание квиза"
                    className="border-gold-950/30 focus:border-gold-950 bg-navy-800/50 text-gold-200 min-h-20"
                    required
                  />
                </div>

                <div className="border-t border-gold-950/30 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gold-950">Вопросы квиза</h3>
                    <Button 
                      type="button"
                      onClick={addQuestion}
                      className="bg-gold-800 text-navy-900 hover:bg-gold-700"
                    >
                      <Icon name="Plus" size={16} className="mr-2" />
                      Добавить вопрос
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {questions.map((question, questionIndex) => (
                      <Card key={questionIndex} className="border border-gold-950/30 bg-navy-800/30">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-gold-950 text-lg">
                              Вопрос {questionIndex + 1}
                            </CardTitle>
                            {questions.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeQuestion(questionIndex)}
                                className="border-red-400 text-red-400 hover:bg-red-400/10"
                              >
                                <Icon name="Trash2" size={16} />
                              </Button>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-gold-950 font-medium">Текст вопроса</Label>
                            <Input
                              value={question.question}
                              onChange={(e) => handleQuestionChange(questionIndex, 'question', e.target.value)}
                              placeholder="Введите вопрос"
                              className="border-gold-950/30 focus:border-gold-950 bg-navy-700/50 text-gold-200"
                              required
                            />
                          </div>

                          <div className="space-y-3">
                            <Label className="text-gold-950 font-medium">Варианты ответов</Label>
                            {question.options.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center space-x-3">
                                <input
                                  type="radio"
                                  name={`correct-${questionIndex}`}
                                  checked={question.correct === optionIndex}
                                  onChange={() => handleQuestionChange(questionIndex, 'correct', optionIndex)}
                                  className="text-gold-950"
                                />
                                <Input
                                  value={option}
                                  onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                                  placeholder={`Вариант ${optionIndex + 1}`}
                                  className="border-gold-950/30 focus:border-gold-950 bg-navy-700/50 text-gold-200 flex-1"
                                  required
                                />
                                <Label className="text-gold-200 text-sm whitespace-nowrap">
                                  {question.correct === optionIndex ? 'Правильный' : 'Вариант'}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {quizData.title && (
                  <div className="border border-gold-950/30 rounded-lg p-4 bg-navy-800/30">
                    <h4 className="text-gold-950 font-medium mb-3 flex items-center">
                      <Icon name="QrCode" size={20} className="mr-2" />
                      Предварительный просмотр QR-кода
                    </h4>
                    <div className="flex items-center justify-center">
                      <img 
                        src={generateQRCode(`https://gamezone.dev/quiz/${Date.now()}`)} 
                        alt="QR код для квиза"
                        className="w-32 h-32 rounded border border-gold-950/50"
                      />
                    </div>
                    <p className="text-center text-gold-200 text-sm mt-2">
                      QR-код будет создан автоматически после сохранения
                    </p>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button 
                    type="submit"
                    className="bg-gold-950 text-navy-900 hover:bg-gold-800 flex-1"
                    disabled={questions.some(q => !q.question || q.options.some(opt => !opt))}
                  >
                    <Icon name="Save" size={20} className="mr-2" />
                    Создать квиз
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/')}
                    className="border-gold-950 text-gold-950 hover:bg-gold-950/10"
                  >
                    <Icon name="X" size={20} className="mr-2" />
                    Отмена
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;