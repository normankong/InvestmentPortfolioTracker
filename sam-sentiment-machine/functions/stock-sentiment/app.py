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

# Get the Information from the Environment Variable
TABLE_NAME = os.environ.get("TABLE_NAME")

def handler(event, context):

    logging.basicConfig(format='%(levelname)s: %(message)s', level=logging.INFO)

    logger.info(event)

    symbol = event["symbol"]
    messages = event["messages"]

    logger.info(f'Received symbol: {symbol}')
    logger.info(f'Received messages: {messages}')

    # If No Tweets related to this stock
    if (len(messages) == 0):
        logger.info("No tweets found for symbol: " + symbol)

        data = {
            'comment' : "N/A",
            'positive' : 0,
            'negative' : 0,
            'neutral' : 0,
            'mixed' : 0
        }

        sentiment = "No tweets found for symbol: " + symbol
    else:
        # Clean up Twitter Information before sending to Comprehend
        buffer = ""
        for x in messages:
            buffer += (p.clean(x["text"]))

        # Trigger Sentiment Analysis
        comp_detect = ComprehendDetect(boto3.client('comprehend'))
        sentiment = comp_detect.detect_sentiment(buffer, 'en')

        # Log the sentiment response
        logger.info("Sentiment Output " , sentiment)

        data = {
            'comment' : sentiment['Sentiment'],
            'positive' : Decimal(str(sentiment['SentimentScore']['Positive'])),
            'negative' : Decimal(str(sentiment['SentimentScore']['Negative'])),
            'neutral' : Decimal(str(sentiment['SentimentScore']['Neutral'])),
            'mixed' : Decimal(str(sentiment['SentimentScore']['Mixed']))
        }

    # Update to the database
    table = dynamodb.Table(TABLE_NAME)
    response = table.update_item(
        Key= { "symbol" : symbol },
        UpdateExpression="set sentiment = :r,  #ts = :t",
        ExpressionAttributeNames={
            "#ts": "timestamp"
        },
        ExpressionAttributeValues={
            ":r": data,
            ":t" : str(datetime.now())
        },
        ReturnValues="UPDATED_NEW"
    )

    return sentiment

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