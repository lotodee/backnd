import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UrlShortener from 'App/Models/UrlShortener'
import { v4 as uuidv4 } from 'uuid';
export default class UrlShortenerController {



  private readonly BASE_URL = 'http://localhost:3333/api';

  private async generateShortUrl(_originalUrl: string): Promise<string> {
    let shortUrl: string;

    while (true) {
      shortUrl = uuidv4().slice(0, 6);
      const existingUrlShortener = await UrlShortener.findBy('shortenedUrl', shortUrl);
      if (!existingUrlShortener) {
        return shortUrl;
      }
    }
  }

  public async store({ request, response, auth }: HttpContextContract) {
    try {
      // Get the authenticated user
      const user = auth.use("api").user;

      // Check if the user is defined
      if (!user) {
        return response.status(401).json({ message: 'Unauthorized' });
      }

      const { name, description, link } = request.all();
      const userId = user.id;
      const shortenedUrl = await this.generateShortUrl(link);
      await UrlShortener.create({
        name,
        description,
        originalUrl: link,
        shortenedUrl: shortenedUrl,
        userId,
      });

      return response.status(201).json({ shortenedUrl: `${this.BASE_URL}/${shortenedUrl}` });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ message: 'Internal Server Error' });
    }
  }

  public async redirect({ request, response }: HttpContextContract) {
    const shortenedUrl = request.param('shortenedUrl');


    const urlShortener = await UrlShortener.findBy('shortened_url', shortenedUrl);
    if (urlShortener) {
      return response.redirect(urlShortener.originalUrl);
    }

    return response.status(404).json({ message: 'Shortened URL not found' });
  }
  public async getAll({ response, auth }: HttpContextContract) {
    const user = auth.use("api").user;


    if (!user) {
      return response.status(401).json({ message: 'Unauthorized' });
    }

    const urlShorteners = await UrlShortener.query()
      .where('user_id', user.id)
      .select('name', 'description', 'shortened_url');

    return response.json(urlShorteners);
  }
}
