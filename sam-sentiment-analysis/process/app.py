import os
import json
import requests
import preprocessor as p
import logging
import boto3

from botocore.exceptions import ClientError
from datetime import datetime
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

def lambda_handler(event, context):

    logging.basicConfig(format='%(levelname)s: %(message)s', level=logging.INFO)

    logger.info(event)

    body = event['Records'][0]['body']
    message = json.loads(body)
    logger.info(message)

    symbol = message['Message']
    logger.info(f'Received symbol: {symbol}')

    # Trigger twitter API
    twitter = TwitterFetch()
    json_response = twitter.connect_to_endpoint(symbol)

    # Log the Twitter Response
    response = json.dumps(json_response, indent=4, sort_keys=True)
    logger.info(response)

    if data in json_response:
        logger.info("No tweets found for symbol: " + symbol)

        data = {
                'symbol': symbol,
                'sentiment' : {
                    'comment' : "N/A",
                    'positive' : 0,
                    'negative' : 0,
                    'neutral' : 0,
                    'mixed' : 0
                },
                'twitter' : [],
                "timestamp" : str(datetime.now())
            }

        # Insert / Update to the database
        response = table.put_item(Item=data)
        return "No tweets found for symbol: " + symbol

    buffer = ""
    for x in json_response["data"]:
        buffer += (p.clean(x["text"]))

    # Trigger Sentiment Analysis
    comp_detect = ComprehendDetect(boto3.client('comprehend'))
    sentiment = comp_detect.detect_sentiment(buffer, 'en')

    # Log the sentiment response
    logger.info("Sentiment Output " , sentiment)

    # Write to DynamoDB
    tableName = os.environ.get("TABLE_NAME")
    table = dynamodb.Table(tableName)

    data = {
            'symbol': symbol,
            'sentiment' : {
                'comment' : sentiment['Sentiment'],
                'positive' : Decimal(str(sentiment['SentimentScore']['Positive'])),
                'negative' : Decimal(str(sentiment['SentimentScore']['Negative'])),
                'neutral' : Decimal(str(sentiment['SentimentScore']['Neutral'])),
                'mixed' : Decimal(str(sentiment['SentimentScore']['Mixed']))
            },
            'twitter' : json_response["data"],
            "timestamp" : str(datetime.now())
        }

    # Insert / Update to the database
    response = table.put_item(Item=data)

    return sentiment['Sentiment']

class TwitterFetch:
    """
    Fetch tweets from twitter.
    """
    def __init__(self):

        self.bearer_token = os.environ.get("BEARER_TOKEN")

        self.search_url = "https://api.twitter.com/2/tweets/search/recent"

    def bearer_oauth(self, r):
        """
        Method required by bearer token authentication.
        """

        r.headers["Authorization"] = f"Bearer {self.bearer_token}"
        r.headers["User-Agent"] = "v2RecentSearchPython"
        return r

    def connect_to_endpoint(self, params):

        # Optional params: start_time,end_time,since_id,until_id,max_results,next_token,
        # expansions,tweet.fields,media.fields,poll.fields,place.fields,user.fields
        param = {'query': f'{params} is:verified lang:en' , 'max_results': '20', 'tweet.fields' : 'lang,text'}

        response = requests.get(self.search_url, auth=self.bearer_oauth, params=param)

        if response.status_code != 200:
            raise Exception(response.status_code, response.text)
        return response.json()



class ComprehendDetect:
    """Encapsulates Comprehend detection functions."""
    def __init__(self, comprehend_client):
        """
        :param comprehend_client: A Boto3 Comprehend client.
        """
        self.comprehend_client = comprehend_client


    def detect_languages(self, text):
        """
        Detects languages used in a document.

        :param text: The document to inspect.
        :return: The list of languages along with their confidence scores.
        """
        try:
            response = self.comprehend_client.detect_dominant_language(Text=text)
            languages = response['Languages']
            logger.info("Detected %s languages.", len(languages))
        except ClientError:
            logger.exception("Couldn't detect languages.")
            raise
        else:
            return languages

    def detect_entities(self, text, language_code):
        """
        Detects entities in a document. Entities can be things like people and places
        or other common terms.

        :param text: The document to inspect.
        :param language_code: The language of the document.
        :return: The list of entities along with their confidence scores.
        """
        try:
            response = self.comprehend_client.detect_entities(
                Text=text, LanguageCode=language_code)
            entities = response['Entities']
            logger.info("Detected %s entities.", len(entities))
        except ClientError:
            logger.exception("Couldn't detect entities.")
            raise
        else:
            return entities

    def detect_key_phrases(self, text, language_code):
        """
        Detects key phrases in a document. A key phrase is typically a noun and its
        modifiers.

        :param text: The document to inspect.
        :param language_code: The language of the document.
        :return: The list of key phrases along with their confidence scores.
        """
        try:
            response = self.comprehend_client.detect_key_phrases(
                Text=text, LanguageCode=language_code)
            phrases = response['KeyPhrases']
            logger.info("Detected %s phrases.", len(phrases))
        except ClientError:
            logger.exception("Couldn't detect phrases.")
            raise
        else:
            return phrases

    def detect_pii(self, text, language_code):
        """
        Detects personally identifiable information (PII) in a document. PII can be
        things like names, account numbers, or addresses.

        :param text: The document to inspect.
        :param language_code: The language of the document.
        :return: The list of PII entities along with their confidence scores.
        """
        try:
            response = self.comprehend_client.detect_pii_entities(
                Text=text, LanguageCode=language_code)
            entities = response['Entities']
            logger.info("Detected %s PII entities.", len(entities))
        except ClientError:
            logger.exception("Couldn't detect PII entities.")
            raise
        else:
            return entities

    def detect_sentiment(self, text, language_code):
        """
        Detects the overall sentiment expressed in a document. Sentiment can
        be positive, negative, neutral, or a mixture.

        :param text: The document to inspect.
        :param language_code: The language of the document.
        :return: The sentiments along with their confidence scores.
        """
        try:
            response = self.comprehend_client.detect_sentiment(
                Text=text, LanguageCode=language_code)
            logger.info("Detected primary sentiment %s.", response['Sentiment'])
        except ClientError:
            logger.exception("Couldn't detect sentiment.")
            raise
        else:
            return response

    def detect_syntax(self, text, language_code):
        """
        Detects syntactical elements of a document. Syntax tokens are portions of
        text along with their use as parts of speech, such as nouns, verbs, and
        interjections.

        :param text: The document to inspect.
        :param language_code: The language of the document.
        :return: The list of syntax tokens along with their confidence scores.
        """
        try:
            response = self.comprehend_client.detect_syntax(
                Text=text, LanguageCode=language_code)
            tokens = response['SyntaxTokens']
            logger.info("Detected %s syntax tokens.", len(tokens))
        except ClientError:
            logger.exception("Couldn't detect syntax.")
            raise
        else:
            return tokens