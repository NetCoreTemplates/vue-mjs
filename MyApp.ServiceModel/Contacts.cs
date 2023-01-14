using System.Collections.Generic;
using MyApp.ServiceModel.Types;
using ServiceStack;

namespace MyApp.ServiceModel;

// Custom Routes are unnecessary, uncomment to enable pretty URL access to APIs
// [Route("/contacts", "GET")]
// [Route("/contacts/{Id}", "GET")]
[Tag("contacts"), ValidateIsAuthenticated]
public class GetContacts : IGet, IReturn<GetContactsResponse>
{
    public int? Id { get; set; }
}
public class GetContactsResponse 
{
    public List<Contact>? Results { get; set; }
    public ResponseStatus? ResponseStatus { get; set; }
}

//[Route("/contacts", "POST")]
[Tag("contacts"), ValidateIsAuthenticated]
public class CreateContact : IPost, IReturn<CreateContactResponse>
{
    // Declarative Validation Example 
    [ValidateNotEmpty(Message = "Please choose a title")]
    public Title? Title { get; set; }
    [ValidateNotEmpty]
    public string? Name { get; set; }
    [Validate("ValidColor()", Message = "Must be a valid color")]
    [Input(Type="select", EvalAllowableEntries = "AppData.Colors")] // Used in API Explorer
    public string? Color { get; set; }
    [ValidateNotEmpty(Message = "Please select your favorite genre")]
    public FilmGenre? FavoriteGenre { get; set; }
    [ValidateGreaterThan(13, Message = "Contacts must be older than 13")]
    public int Age { get; set; }
    [ValidateEqual(true, Message = "You must agree before submitting")]
    public bool Agree { get; set; }
}
public class CreateContactResponse 
{
    public Contact? Result { get; set; }
    public ResponseStatus? ResponseStatus { get; set; }
}

//[Route("/contacts/{Id}", "POST PUT")]
[Tag("contacts"), ValidateIsAuthenticated]
public class UpdateContact : IPatch, IReturn<UpdateContactResponse>
{
    public int Id { get; set; }
    public Title Title { get; set; }
    public string? Name { get; set; }
    [Input(Type="select", EvalAllowableEntries = "AppData.Colors")] // Used in API Explorer
    public string? Color { get; set; }
    public FilmGenre? FavoriteGenre { get; set; }
    public int Age { get; set; }
}
public class UpdateContactResponse 
{
    public ResponseStatus? ResponseStatus { get; set; }
}

// [Route("/contacts/{Id}", "DELETE")]
// [Route("/contacts/{Id}/delete", "POST")] // more accessible from HTML
[Tag("contacts"), ValidateIsAuthenticated]
public class DeleteContact : IDelete, IReturnVoid
{
    public int Id { get; set; }
}
