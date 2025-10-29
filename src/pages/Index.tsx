import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Icon from '@/components/ui/icon';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  origin: string;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Да Хун Пао',
    description: 'Легендарный утёсный улун с глубоким минеральным вкусом',
    price: 2800,
    category: 'Улун',
    origin: 'Китай',
    image: '🍵'
  },
  {
    id: 2,
    name: 'Серебряные иглы',
    description: 'Изысканный белый чай из нежных почек',
    price: 3200,
    category: 'Белый чай',
    origin: 'Китай',
    image: '🫖'
  },
  {
    id: 3,
    name: 'Матча церемониальная',
    description: 'Премиальная матча для чайной церемонии',
    price: 4500,
    category: 'Зелёный чай',
    origin: 'Япония',
    image: '🍃'
  },
  {
    id: 4,
    name: 'Пуэр Шэн 15 лет',
    description: 'Выдержанный сырой пуэр с богатым букетом',
    price: 5200,
    category: 'Пуэр',
    origin: 'Китай',
    image: '🌿'
  },
  {
    id: 5,
    name: 'Дарджилинг First Flush',
    description: 'Элитный чёрный чай первого сбора',
    price: 2400,
    category: 'Чёрный чай',
    origin: 'Индия',
    image: '☕'
  },
  {
    id: 6,
    name: 'Те Гуань Инь',
    description: 'Классический улун с цветочным ароматом',
    price: 3100,
    category: 'Улун',
    origin: 'Китай',
    image: '🍵'
  }
];

export default function Index() {
  const [currentPage, setCurrentPage] = useState<'home' | 'catalog' | 'about' | 'delivery' | 'contacts'>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');

  const categories = ['Все', 'Улун', 'Белый чай', 'Зелёный чай', 'Пуэр', 'Чёрный чай'];

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredProducts = selectedCategory === 'Все' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-primary font-serif">TEALEAF</h1>
            
            <nav className="hidden md:flex gap-8">
              <button 
                onClick={() => setCurrentPage('home')} 
                className={`relative transition-colors ${currentPage === 'home' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
              >
                Главная
              </button>
              <button 
                onClick={() => setCurrentPage('catalog')} 
                className={`relative transition-colors ${currentPage === 'catalog' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
              >
                Каталог
              </button>
              <button 
                onClick={() => setCurrentPage('about')} 
                className={`relative transition-colors ${currentPage === 'about' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
              >
                О нас
              </button>
              <button 
                onClick={() => setCurrentPage('delivery')} 
                className={`relative transition-colors ${currentPage === 'delivery' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
              >
                Доставка
              </button>
              <button 
                onClick={() => setCurrentPage('contacts')} 
                className={`relative transition-colors ${currentPage === 'contacts' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
              >
                Контакты
              </button>
            </nav>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="relative">
                  <Icon name="ShoppingCart" size={20} />
                  {totalItems > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-secondary text-secondary-foreground">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                  <SheetTitle className="font-serif text-2xl">Корзина</SheetTitle>
                </SheetHeader>
                <div className="mt-8 space-y-4">
                  {cart.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Корзина пуста</p>
                  ) : (
                    <>
                      {cart.map(item => (
                        <div key={item.id} className="flex gap-4 pb-4 border-b border-border">
                          <div className="text-4xl">{item.image}</div>
                          <div className="flex-1">
                            <h3 className="font-serif font-semibold">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">{item.price} ₽</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Icon name="Minus" size={14} />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Icon name="Plus" size={14} />
                              </Button>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Icon name="X" size={18} />
                          </Button>
                        </div>
                      ))}
                      <div className="pt-4">
                        <div className="flex justify-between text-lg font-semibold mb-4">
                          <span>Итого:</span>
                          <span className="text-secondary">{totalPrice.toLocaleString()} ₽</span>
                        </div>
                        <Button className="w-full" size="lg">
                          Оформить заказ
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main>
        {currentPage === 'home' && (
          <>
            <section className="relative py-24 bg-gradient-to-br from-primary/10 to-background">
              <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center animate-fade-in">
                  <h2 className="text-5xl md:text-6xl font-bold font-serif text-primary mb-6">
                    Искусство чаепития
                  </h2>
                  <p className="text-xl text-muted-foreground mb-8">
                    Коллекция премиальных сортов чая со всего мира для истинных ценителей
                  </p>
                  <div className="flex gap-4 justify-center flex-wrap">
                    <Button size="lg" onClick={() => setCurrentPage('catalog')}>
                      Смотреть каталог
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => setCurrentPage('about')}>
                      О компании
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            <section className="py-16">
              <div className="container mx-auto px-4">
                <h3 className="text-3xl font-bold font-serif text-center mb-12">Избранные сорта</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {products.slice(0, 3).map((product, idx) => (
                    <Card key={product.id} className="transition-transform duration-300 hover:scale-105 animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                      <CardContent className="pt-6">
                        <div className="text-6xl text-center mb-4">{product.image}</div>
                        <h4 className="text-xl font-serif font-semibold mb-2">{product.name}</h4>
                        <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                        <div className="flex gap-2 mb-4">
                          <Badge variant="secondary">{product.category}</Badge>
                          <Badge variant="outline">{product.origin}</Badge>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-secondary">{product.price} ₽</span>
                        <Button onClick={() => addToCart(product)}>
                          <Icon name="ShoppingCart" size={18} className="mr-2" />
                          В корзину
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

            <section className="py-16 bg-muted/30">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div className="animate-fade-in">
                    <Icon name="Award" size={48} className="mx-auto mb-4 text-secondary" />
                    <h4 className="text-xl font-serif font-semibold mb-2">Премиальное качество</h4>
                    <p className="text-muted-foreground">Только лучшие сорта от проверенных поставщиков</p>
                  </div>
                  <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
                    <Icon name="Truck" size={48} className="mx-auto mb-4 text-secondary" />
                    <h4 className="text-xl font-serif font-semibold mb-2">Быстрая доставка</h4>
                    <p className="text-muted-foreground">Доставим свежий чай в течение 1-3 дней</p>
                  </div>
                  <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
                    <Icon name="Heart" size={48} className="mx-auto mb-4 text-secondary" />
                    <h4 className="text-xl font-serif font-semibold mb-2">Экспертная поддержка</h4>
                    <p className="text-muted-foreground">Поможем подобрать идеальный чай</p>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {currentPage === 'catalog' && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-4xl font-bold font-serif text-center mb-8">Каталог чая</h2>
              
              <div className="flex gap-2 mb-8 flex-wrap justify-center">
                {categories.map(cat => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {filteredProducts.map((product, idx) => (
                  <Card key={product.id} className="transition-transform duration-300 hover:scale-105 animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
                    <CardContent className="pt-6">
                      <div className="text-6xl text-center mb-4">{product.image}</div>
                      <h4 className="text-xl font-serif font-semibold mb-2">{product.name}</h4>
                      <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                      <div className="flex gap-2 mb-4">
                        <Badge variant="secondary">{product.category}</Badge>
                        <Badge variant="outline">{product.origin}</Badge>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-secondary">{product.price} ₽</span>
                      <Button onClick={() => addToCart(product)}>
                        <Icon name="ShoppingCart" size={18} className="mr-2" />
                        В корзину
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {currentPage === 'about' && (
          <section className="py-16">
            <div className="container mx-auto px-4 max-w-3xl">
              <h2 className="text-4xl font-bold font-serif text-center mb-8 animate-fade-in">О компании</h2>
              <div className="prose prose-lg mx-auto text-muted-foreground space-y-6 animate-fade-in">
                <p>
                  TEALEAF — это больше чем интернет-магазин. Это сообщество людей, влюблённых в культуру чая и стремящихся к совершенству в каждой чашке.
                </p>
                <p>
                  Мы путешествуем по чайным плантациям Китая, Японии, Индии и других стран, чтобы находить и привозить вам самые изысканные и редкие сорта. Каждый чай в нашей коллекции проходит строгий отбор и тестирование нашими экспертами.
                </p>
                <p>
                  Наша миссия — сделать премиальный чай доступным для всех ценителей и помочь каждому открыть для себя удивительный мир чайной культуры.
                </p>
              </div>
            </div>
          </section>
        )}

        {currentPage === 'delivery' && (
          <section className="py-16">
            <div className="container mx-auto px-4 max-w-3xl">
              <h2 className="text-4xl font-bold font-serif text-center mb-8 animate-fade-in">Доставка и оплата</h2>
              <div className="space-y-8 animate-fade-in">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-serif font-semibold mb-4 flex items-center gap-2">
                      <Icon name="Truck" size={24} className="text-secondary" />
                      Условия доставки
                    </h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Бесплатная доставка при заказе от 5 000 ₽</li>
                      <li>• Курьерская доставка по Москве — 300 ₽</li>
                      <li>• Доставка в регионы — от 400 ₽</li>
                      <li>• Срок доставки: 1-3 рабочих дня</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-serif font-semibold mb-4 flex items-center gap-2">
                      <Icon name="CreditCard" size={24} className="text-secondary" />
                      Способы оплаты
                    </h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Оплата картой онлайн</li>
                      <li>• Наличными курьеру</li>
                      <li>• Банковский перевод для юридических лиц</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        )}

        {currentPage === 'contacts' && (
          <section className="py-16">
            <div className="container mx-auto px-4 max-w-3xl">
              <h2 className="text-4xl font-bold font-serif text-center mb-8 animate-fade-in">Контакты</h2>
              <div className="space-y-6 animate-fade-in">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <Icon name="MapPin" size={24} className="text-secondary mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">Адрес</h3>
                        <p className="text-muted-foreground">г. Москва, ул. Чайная, д. 15</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Icon name="Phone" size={24} className="text-secondary mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">Телефон</h3>
                        <p className="text-muted-foreground">+7 (495) 123-45-67</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Icon name="Mail" size={24} className="text-secondary mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">Email</h3>
                        <p className="text-muted-foreground">info@tealeaf.ru</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Icon name="Clock" size={24} className="text-secondary mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">Режим работы</h3>
                        <p className="text-muted-foreground">Ежедневно с 10:00 до 20:00</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="bg-primary text-primary-foreground py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-serif text-2xl">TEALEAF</p>
            <p className="text-sm">© 2024 TEALEAF. Премиальный чай для ценителей</p>
            <div className="flex gap-4">
              <Icon name="Instagram" size={24} className="cursor-pointer hover:opacity-80 transition-opacity" />
              <Icon name="Facebook" size={24} className="cursor-pointer hover:opacity-80 transition-opacity" />
              <Icon name="Mail" size={24} className="cursor-pointer hover:opacity-80 transition-opacity" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}