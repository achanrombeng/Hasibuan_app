<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\ArticleStatus;
use App\Models\Article;
use App\Models\User;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::whereHas('roles', function ($query) {
            $query->whereIn('name', ['admin', 'super-admin']);
        })->first() ?? User::first();

        $articles = array (
  0 => 
  array (
    'title' => 'VILLA PROJECT IN LANGKAWI MALAYSIA 2020',
    'slug' => 'villa-project-in-langkawi-malaysia-2020',
    'excerpt' => 'This is our 2020 Villa project using our best sellers Teak Wood Furniture,Special Designs are created from our talented customer to make all rooms in perfect sanctuary.',
    'content' => '<h2>Villa Project in Langkawi with Teak Solid Wood Furniture</h2>
<p>This is our 2020 Villa project using our best sellers Teak Wood Furniture,Special Designs are created from our talented customer to make all rooms in perfect sanctuary.</p>
<p>Quality of the material itself choosen by us using premium Solid Teak Wood by Indonesian government plantations  woods.</p>
<p>Every details in this pieces created with the very best constructions in every furniture for durables needs in long term  usage for the villa guest.</p>
<p>This Villa Projects we combining the  beautiful teak wood with natural rattan looks to make the designs more cheerful to fit the request our customers that the Villa Guest which stay in their Villa can feel the homey  as their own house.</p>
<p>One of Hasibuan Designs masterpieces we put on this projects,to show that our furniture can showing their best character and quality to make all rooms in great ambience.<img decoding="async" class="alignnone size-full wp-image-13092" src="http://hasibuandesigns.com/wp-content/uploads/2021/04/LA-VILLA-1.jpg" alt="" width="1080" height="718"><img decoding="async" class="alignnone size-full wp-image-13093" src="http://hasibuandesigns.com/wp-content/uploads/2021/04/LA-VILLA-2.jpg" alt="" width="960" height="618"><img loading="lazy" decoding="async" class="alignnone size-full wp-image-13094" src="http://hasibuandesigns.com/wp-content/uploads/2021/04/LA-VILLA-3.jpg" alt="" width="1024" height="681"><img loading="lazy" decoding="async" class="alignnone size-full wp-image-13095" src="http://hasibuandesigns.com/wp-content/uploads/2021/04/LA-VILLA-4.jpg" alt="" width="1080" height="718"><img loading="lazy" decoding="async" class="alignnone size-full wp-image-13096" src="http://hasibuandesigns.com/wp-content/uploads/2021/04/WhatsApp-Image-2021-04-13-at-21.56.36.jpg" alt="" width="1080" height="718"></p>',
    'featured_image' => 'articles/villa-project-in-langkawi-malaysia-2020.jpeg',
    'author' => 'Hasibuan Design',
    'status' => 'published',
    'tags' => 
    array (
      0 => 'Projects & Portfolios',
      1 => 'Hasibuan Designs',
      2 => 'Teak Craftsmanship',
    ),
    'read_time' => 2,
    'views' => 160,
    'meta_title' => 'VILLA PROJECT IN LANGKAWI MALAYSIA 2020 | Hasibuan Design',
    'meta_description' => 'This is our 2020 Villa project using our best sellers Teak Wood Furniture,Special Designs are created from our talented customer to make all rooms in perfect sanctuary.',
    'meta_keywords' => 'Projects & Portfolios, Hasibuan Designs, Teak Craftsmanship',
    'published_at' => '2021-04-18T06:27:08.000000Z',
  ),
  1 => 
  array (
    'title' => 'HOTEL PROJECT IN DUBAI 244 ROOMS',
    'slug' => 'hotel-project-in-dubai-244-rooms',
    'excerpt' => 'The Ancient looks for this project was the bigest challenge for Hasibuan Designs ,with total for 244 rooms including the  public area,become our first huge hotel project,this hotel located in Sharjah,...',
    'content' => '<h1>Teak Solid Wood Hotel Rooms</h1>
<p>The Ancient looks for this project was the bigest challenge for Hasibuan Designs ,with total for 244 rooms including the  public area,become our first huge hotel project,this hotel located in Sharjah,Dubai .</p>
<p>The request using solid teak wood to be created in ages looks what will be this hotel to be.We using a technique to make all furniture looks damages and ages.</p>
<p><img decoding="async" class="alignnone size-full wp-image-13006" src="http://hasibuandesigns.com/wp-content/uploads/2021/04/150366513.jpg" alt="" width="1024" height="683"></p>
<div id="attachment_13007" style="width: 1034px" class="wp-caption alignnone"><img decoding="async" aria-describedby="caption-attachment-13007" class="size-full wp-image-13007" src="http://hasibuandesigns.com/wp-content/uploads/2021/04/160840139.jpg" alt="" width="1024" height="683"><p id="caption-attachment-13007" class="wp-caption-text">Teak Poster Bed</p></div>
<div id="attachment_13008" style="width: 1034px" class="wp-caption alignnone"><img loading="lazy" decoding="async" aria-describedby="caption-attachment-13008" class="size-full wp-image-13008" src="http://hasibuandesigns.com/wp-content/uploads/2021/04/155577830.jpg" alt="" width="1024" height="683"><p id="caption-attachment-13008" class="wp-caption-text">Teak Twin Bed</p></div>
<div id="attachment_13009" style="width: 1290px" class="wp-caption alignnone"><img loading="lazy" decoding="async" aria-describedby="caption-attachment-13009" class="size-full wp-image-13009" src="http://hasibuandesigns.com/wp-content/uploads/2021/04/PHOTO-2018-01-15-10-36-34.jpg" alt="" width="1280" height="960"><p id="caption-attachment-13009" class="wp-caption-text">Teak Bed Solid</p></div>
<div id="attachment_13010" style="width: 970px" class="wp-caption alignnone"><img loading="lazy" decoding="async" aria-describedby="caption-attachment-13010" class="size-full wp-image-13010" src="http://hasibuandesigns.com/wp-content/uploads/2021/04/PHOTO-2017-10-24-19-34-59-2.jpg" alt="" width="960" height="1280"><p id="caption-attachment-13010" class="wp-caption-text">Teak Bedside Table</p></div>',
    'featured_image' => 'articles/hotel-project-in-dubai-244-rooms.jpg',
    'author' => 'Hasibuan Design',
    'status' => 'published',
    'tags' => 
    array (
      0 => 'Projects & Portfolios',
      1 => 'Hasibuan Designs',
      2 => 'Teak Craftsmanship',
    ),
    'read_time' => 2,
    'views' => 380,
    'meta_title' => 'HOTEL PROJECT IN DUBAI 244 ROOMS | Hasibuan Design',
    'meta_description' => 'The Ancient looks for this project was the bigest challenge for Hasibuan Designs ,with total for 244 rooms including the  public area,become our first huge hotel project,this hotel located in Sharjah,...',
    'meta_keywords' => 'Projects & Portfolios, Hasibuan Designs, Teak Craftsmanship',
    'published_at' => '2021-04-10T04:09:27.000000Z',
  ),
  2 => 
  array (
    'title' => 'Introducing Silver Leaf Bedroom Furniture – Style Guide',
    'slug' => 'introducing-silver-leaf-bedroom-furniture-style-guide',
    'excerpt' => 'What is Silver Leaf Bedroom Furniture?',
    'content' => '<p><strong>What is Silver Leaf Bedroom Furniture?</strong></p>
<p>Silver Leaf Bedroom Furniture is a unique furniture finish achieved by gilding solid wood furniture pieces with Silver Leaf. Real Silver Leaf is a thin foil made of metal leaf used for decoration and when applied to furniture it makes an opulent statement as well as giving an exquisite look to your home.</p>
<p>Original Silver Leaf Finish vs Paint Finish</p>
<p>Something you need to be aware of when buying silver leaf furniture is that it can be used to refer to three different types of finish;</p>
<p>1- Authentic silver leaf – Also known as composition leaf or schlagmetal, it’s made of pure silver. Other metal leaf types are made of pure gold, copper, aluminium, brass or palladium.</p>
<p>2- Imitation leaf – As the name suggests, this is a thin foil that looks like silver leaf or gold leaf, but isn’t real. This makes the products cheaper, but if quality and authenticity are important to you, you’ll want the real thing.</p>
<p>3- Coloured paint – If affordability is key, you might go for this option, which is silver-coloured paint on top of grey primer and has much the same effect with a considerably lower price tag.</p>
<p>It’s not just the materials that make authentic silver leaf the most expensive option, a lot of it comes down to the requirement for professional gilders using special tools to apply it to the furniture.</p>
<p>Gilding is the process of applying fine gold leaf or sliver leaf to solid surfaces such as wood, stone or metal to give a luxurious decorative finish.This can be done by burnishing with an agate stone tool, as shown below:</p>
<p>When it comes to wooden furniture, Mechanical gilding is the most commonly used technique to apply silver leaf, by burnishing and water gilding or oil gilding. Water gilding is the most common method of doing this, and it requires experienced craftsmen to achieve the desired effects.</p>
<p> </p>
<p><strong>The History of Silver Leaf Furniture</strong></p>
<p>The logic behind applying silver to furniture to signify wealth and power is a straightforward one and has been popular throughout human history, right up to the modern day.</p>
<p>As far back as the fourth century BC, silver was being used to decorate items stored in tombs in Greece, and several fragments of a stool were found in Thessaloniki where all that was left was the parts of it that was covered in silver foil.</p>
<p>Similarly, in Roman times, Sella stools and Fulcra couches were commonly used by people of all social levels, but the rich and powerful had them covered in silver or gold leaf.</p>
<p>Style and Decoration Perspectives: Classic and Contemporary</p>
<p>While metal leaf furniture may have been used down the centuries to either demonstrate or give the impression of wealth and power, it’s actually a very flexible style that fits either a traditional or a contemporary feel.</p>
<p>It all depends how you use it, of course, and what the context of the room is, but silver leaf is a finish that can transform a room into whatever you want it to be. For example, our Régency French Silver Leaf 5 Drawer Chest is available in a choice of two real silver leaf finishes: standard, which has a vibrant silver shine, or antique, which has a rich, mellow tone.</p>
<p>The standard look can really be a statement piece in your room, ostentatious and dazzling, while the more traditional antique style makes it warmer and more classic in look and feel.</p>
<p> </p>
<p><strong>How to Create a Stunning Silver Leaf Bedroom Furniture Style</strong></p>
<p>Silver leaf has always worked incredibly well in bedrooms to give that feeling of luxury and opulence, and our authentic Louis French Silver Leaf range is a great example, with distinctive serpentine curves along with delicate hand-carved scrolls crafted from solid hardwood. This piece provides a statement centerpiece in the master bedroom and it is guaranteed to make an impact. This particular style is well suited to contemporary décor with its bright silver shine.</p>
<p>Meanwhile, the Régency French Silver Leaf range is hand gilded and silver-leafed to high standards by our British artisans and comes with the choice between a standard or antique finish to suit whatever theme you are going with in your room. The muted antique finish complements tradition and rustic spaces while the standard finish boasts a bright silver shine which is perfect for adding a modern feel.</p>
<p> </p>
<p><strong>Silver Leaf Furniture: Share the Style</strong></p>
<p>Are you enchanted with silver leaf bedroom furniture? Perhaps you have a silver leaf dining table or a beautiful silver leaf cabinet? Let us know what you think in the comments below. If you have used metal leaf furniture to enhance your home, feel free to share with us any images you have too via our social media channels. We love to see how you style it.</p>',
    'featured_image' => 'articles/introducing-silver-leaf-bedroom-furniture-style-guide.jpg',
    'author' => 'Hasibuan Design',
    'status' => 'published',
    'tags' => 
    array (
      0 => 'News & Information',
      1 => 'Hasibuan Designs',
      2 => 'Teak Craftsmanship',
    ),
    'read_time' => 5,
    'views' => 173,
    'meta_title' => 'Introducing Silver Leaf Bedroom Furniture – Style Guide | Hasibuan Design',
    'meta_description' => 'What is Silver Leaf Bedroom Furniture?',
    'meta_keywords' => 'News & Information, Hasibuan Designs, Teak Craftsmanship',
    'published_at' => '2021-03-13T08:02:43.000000Z',
  ),
  3 => 
  array (
    'title' => 'Choosing the Right Style for your Home',
    'slug' => 'choosing-the-right-style-for-your-home',
    'excerpt' => 'Designing your home is one of the most exciting stages, as its the part where you can really put your own stamp on your homes décor and make it personal and inviting. There are so many different styl...',
    'content' => '<p>Designing your home is one of the most exciting stages, as its the part where you can really put your own stamp on your homes décor and make it personal and inviting. There are so many different styles and themes that you can go for, and you can have so much fun with the whole design process. Ensuring your home is as inviting, warm and homely as you can is so important in making sure youre happy and comfortable, whilst being able to show off your personal style to guests. Focus on what interests you, what you like and what will work best for you, as this is your home and that is the most important thing!</p>
<p> </p>
<p><strong>Know What You Like</strong></p>
<p>Start by discovering exactly what you like. Whether you want to go for a Country theme, Modern, Rustic, Contemporary or Eclectic, once youre confident in the theme you want to go for, you can begin to develop your ideas further based around this particular choice. If youre style is Country décor, you may incorporate beautiful furnishings made of solid oak, similar to our Country Oak Range, whilst incorporating beautiful designs with rich colours or patterns, such as dark reds, greens, browns and Tweeds. Country style can be emphasised perfectly through the detailing, introducing an Agar to your kitchen, along with statement chairs with the tweed upholstery and antique accessories. If youre more of a Contemporary person, your home will be made up of smooth surfaces, neat edges, sleek finishings and soft tones. Introducing gentle tones of cream, grey, brown and beige will work really well in creating the contemporary style you wish to go for. With soft furnishings and statement pieces to add character to the overall look. You then have the Eclectic style décor, which is solely designed around matching the old with the new. From introducing unique, interesting objects to each room, whilst still creating a relaxing, subtle balance its important not to overcrowd but to stick to the eccentric designs with a touch of modern day detailing to emphasise the Eclectic style you wish to go for.</p>
<p> </p>
<p><strong>Mood Boards</strong></p>
<p>Once decided on your style, creating a helpful resource such as a mood board will really help you to keep your ideas and interests pinned to one place. You need to be able to keep your personal style clear throughout, therefore not getting to lost in the overall theme of a room is key. Deciding what elements will work best for you as well as eliminating possible ideas will enable you to progress and become confident in the designs you are going for. Keep in mind the overall style of your home, as this will play a small part in the overall look. If your home is cottage like and quaint, you may find that a country style will work much better, similarly you may find your home reflects a Contemporary style, with neat edges and symmetrical features. You can always experiment with different ideas, to really gain a strong understanding on what is right for you and your home.</p>
<p> </p>
<p><strong>Be Practical</strong></p>
<p>Your next thing to consider is your practicality, as your home needs to suit your needs and daily routines. Designing your home to reflect your style is so important, but having your home work for you is just as necessary. Include features that are going to enable you to live comfortably and happily, being able to relax and wind down whilst also being able to complete your day to day jobs with ease. You dont want to create a home that doesn’t suit your needs or style as your home is a reflection of you. Once you have the perfect style, you can always play around with furnishings and details, however the main theme is one that will emphasise your individuality and character.</p>',
    'featured_image' => 'articles/choosing-the-right-style-for-your-home.jpg',
    'author' => 'Hasibuan Design',
    'status' => 'published',
    'tags' => 
    array (
      0 => 'News & Information',
      1 => 'Hasibuan Designs',
      2 => 'Teak Craftsmanship',
    ),
    'read_time' => 4,
    'views' => 183,
    'meta_title' => 'Choosing the Right Style for your Home | Hasibuan Design',
    'meta_description' => 'Designing your home is one of the most exciting stages, as its the part where you can really put your own stamp on your homes décor and make it personal and inviting. There are so many different styl...',
    'meta_keywords' => 'News & Information, Hasibuan Designs, Teak Craftsmanship',
    'published_at' => '2021-03-13T08:01:23.000000Z',
  ),
  4 => 
  array (
    'title' => 'Creating the Perfect Family Room',
    'slug' => 'creating-the-perfect-family-room',
    'excerpt' => 'Having a family room is one of the best additions to any home. Whilst its always good to have a formal, main living area, a family room or snug is always great for spending valuable one on one time w...',
    'content' => '<p>Having a family room is one of the best additions to any home. Whilst its always good to have a formal, main living area, a family room or snug is always great for spending valuable one on one time with your family. There are so many ways in which you can create the perfect atmosphere and style for your family room, making it homely, inviting and warm.</p>
<p> </p>
<p><strong>Décor</strong></p>
<p>One of the key components to any rooms overall feel is the décor, from colours to themes and designs. Stick to a neutral colour scheme, working with creams, greys and browns. Having neutral colours work perfectly to create a soft, warm feel to the room and this is the exact feel you want when it comes to a cosy living area. The perfect thing about neutral colouring is that you can add complimentary colours through your details such as cushions and throws, which are also great features to add to a living area. Think about cream walls, complimented by oak furnishings and grey or brown features such as sofas, cushions, curtains etc. This will create a beautifully stylish, cosy overall look.</p>
<p> </p>
<p><strong>Keep it practical</strong></p>
<p>In this day and age, with so much technology and digital interaction, its so important to keep up with spending special time with the family. Gathering together in the family room is exactly whats needed to keep those special bonds and spend quality time together. Of course, the best way to really engage with your family is through board games, watching films and general socialising. Make sure your living area has enough seating to fit your family, this way you can all get cosy and settle in for a good film, or you can spread out and play an intense game of Monopoly. Whatever works best for you and your family, making sure the room is practical to your needs is most important. Added bean bags or tables to play your games on and chill out are great as you can never have too much space, and board games can often take up a lot of room! Adding a nice television accompanied by a video gaming system could be great fun to get the family interacting and working together, or against each other, competing to win.</p>
<p> </p>
<p><strong>Character and style</strong></p>
<p>Whilst making sure your room is practical enough for the rest of your family, its always important to remember your homes overall décor and style. Keeping your family room similar to the rest of your homes interior design will ensure your home flows perfectly and fits together really well. Why not look at adding elegant touches such as fancy lighting to add to the ambiance of the room, a nice rug to create extra aesthetical pleasure, or even just candles dotted around the room to emphasise the welcoming atmosphere. One very good feature to add into any home, especially the family room, is family photographs. What makes a room scream family time more than beautiful photos to remind you of the great memories youve all had together. Adding to the overall look of the room, whilst also adding character and a personal touch, photographs are perfect for capturing that family feel and creating the perfect atmosphere for your family space.</p>',
    'featured_image' => 'articles/creating-the-perfect-family-room.jpg',
    'author' => 'Hasibuan Design',
    'status' => 'published',
    'tags' => 
    array (
      0 => 'News & Information',
      1 => 'Hasibuan Designs',
      2 => 'Teak Craftsmanship',
    ),
    'read_time' => 3,
    'views' => 298,
    'meta_title' => 'Creating the Perfect Family Room | Hasibuan Design',
    'meta_description' => 'Having a family room is one of the best additions to any home. Whilst its always good to have a formal, main living area, a family room or snug is always great for spending valuable one on one time w...',
    'meta_keywords' => 'News & Information, Hasibuan Designs, Teak Craftsmanship',
    'published_at' => '2021-03-13T08:00:29.000000Z',
  ),
  5 => 
  array (
    'title' => 'The Best Ways to Refresh Your Home for Spring',
    'slug' => 'the-best-ways-to-refresh-your-home-for-spring',
    'excerpt' => 'With winter finally drawing to a close its time to start focusing on the warmer, brighter days ahead. With the weather brightening up outside, it’s time to focus on your homes interiors and get them l...',
    'content' => '<p>With winter finally drawing to a close its time to start focusing on the warmer, brighter days ahead. With the weather brightening up outside, it’s time to focus on your homes interiors and get them looking and feeling fresher. Spring is the perfect time to introduce something new to your home, from bright colours, new appliances and even simple additions such as new curtains or blinds. Whether you’re looking to make bold, unique statements or you simply want to give your décor a little burst of character, there are plenty of different options for you to choose from!</p>
<p> </p>
<h3><strong>Pops of Colour</strong></h3>
<p>The brighter days instantly put you in a positive mood, so brightening your interiors is going to have the same effect. By adding a pop of colour to your homes décor, you’ll instantly notice a lift in the atmosphere and your home will feel warm and welcoming. Stick to a specific colour scheme, with a strong balance of bold and neutral colours to ensure your interiors flow properly.</p>
<p> </p>
<h3><strong>Strip it Back</strong></h3>
<p>Throughout winter we are all guilty of filling our homes with thick, cosy blankets, Christmassy scented candles, long draping curtains and the odd sheepskin rug to keep us warm and snug, but now that spring is around the corner, it’s time to strip it back and create a cool, airy feel. Swapping your thick curtains for a delicate material, replacing your Christmas candles with some fresh flowers or incense and putting those thick throws into storage will help to lift your rooms feel and prevent it from feeling stuffy and cramped when the warmer weather arrives.</p>
<p> </p>
<h3><strong>Update with Art</strong></h3>
<p>If anything is going to make your interiors burst with character its artwork. Art is perfect for expressing your personal style and interests and keeping your décor stylish and on trend. It doesn’t matter what kind of art you introduce to your home, you can always create a fresh feel with a bold piece positioned neatly in a stylish frame. You then have other features such as ornaments and photographs, these are also perfect for adding a unique touch to your décor and enhancing the overall look.</p>
<p> </p>
<h3><strong>Embrace Nature</strong></h3>
<p>If you really want to gain a fresh, bright feel within your interiors then adding some delicate touches such as beautiful, fresh flowers will help create a gentle ambiance and fill your home with a lovely fresh scent. Similarly, introducing other houseplants such to each room will not only add character and finish the room perfectly, but also help to keep a positive atmosphere flowing throughout your home. Houseplants have many health benefits too, so it’s always a good idea to include them in your interiors.</p>',
    'featured_image' => 'articles/the-best-ways-to-refresh-your-home-for-spring.jpg',
    'author' => 'Hasibuan Design',
    'status' => 'published',
    'tags' => 
    array (
      0 => 'News & Information',
      1 => 'Hasibuan Designs',
      2 => 'Teak Craftsmanship',
    ),
    'read_time' => 3,
    'views' => 208,
    'meta_title' => 'The Best Ways to Refresh Your Home for Spring | Hasibuan Design',
    'meta_description' => 'With winter finally drawing to a close its time to start focusing on the warmer, brighter days ahead. With the weather brightening up outside, it’s time to focus on your homes interiors and get them l...',
    'meta_keywords' => 'News & Information, Hasibuan Designs, Teak Craftsmanship',
    'published_at' => '2021-03-13T07:58:54.000000Z',
  ),
);

        foreach ($articles as $articleData) {
            $articleData['author_id'] = $admin->id ?? null;
            $articleData['status'] = ArticleStatus::PUBLISHED;
            Article::updateOrCreate(
                ['slug' => $articleData['slug']],
                $articleData
            );
        }
    }
}