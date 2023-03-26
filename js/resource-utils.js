function getImageResourcePathByNumber(n)
{
    return "resources/images/cats/" + n + ".jpg";
}

function getNumberOfImageByResourcePath(resourcePath)
{
    var lastIndexOfSlash = resourcePath.lastIndexOf("/");
    var resourceName = resourcePath.substring(lastIndexOfSlash + 1);
    return resourceName.split(".")[0];
}

function getQuestionMarkResourcePath()
{
    return "resources/images/question-mark.webp";
}